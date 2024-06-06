class View {
    constructor() {
        this.searchWrapper = document.querySelector('.search__wrapper');

        this.searchList = this.createElement('ul', 'search__list');
        this.repositoriesList = this.createElement('div', 'repositories__list');

        this.searchWrapper.append(this.searchList);
        this.searchWrapper.append(this.repositoriesList);
    }

    createElement(elementTag, elementClass) {
        const element = document.createElement(elementTag);
        element.classList.add(elementClass);
        return element
    }

    createUser(userData) {
        this.userElement = this.createElement('li', 'search__item');
        this.userElement.addEventListener('click', () => this.showUserData(userData))
        this.userElement.textContent = userData.name;

        this.searchList.append(this.userElement)
    }

    showUserData(userData) {
       this.repositoriesItem = this.createElement('div', 'repositories__item');
       let repositoriesItemInfo = this.createElement('div', 'repositories__item-info');
       repositoriesItemInfo.insertAdjacentHTML('afterbegin', `<span class="name">Name: ${userData.name}</span>
                                                                          <span class="owner">Owner: ${userData.owner.login}</span>
                                                                          <span class="stars">Stars: ${userData.stargazers_count}</span>`)
       this.buttonClose = this.createElement('button', 'close');

       this.repositoriesItem.append(repositoriesItemInfo);
       this.repositoriesItem.append(this.buttonClose);
       this.repositoriesList.append(this.repositoriesItem);

       this.buttonClose.addEventListener('click', (e) => {
           e.target.parentElement.remove()
       })
    }
}

class Search {
    constructor(view) {
        this.view = view;
        this.searchInput = document.querySelector('.search__input');
        this.searchInput.addEventListener('keyup', this.debounce(this.searchUsers.bind(this), 400))
    }

   async searchUsers() {
        try {
            if(this.searchInput.value) {
                this.clearUsers();
                return await fetch(`https://api.github.com/search/repositories?q=${this.searchInput.value}&per_page=5`)
                    .then(response => {
                        if(response.ok) {
                            response.json()
                                .then(response => {
                                    response.items.forEach((user) => {
                                        this.view.createUser(user)
                                    })
                                })
                        }
                    })
            } else {
                this.clearUsers()
            }
        } catch (e) {
            console.log('ERROR ' + e)
        }

    }



    clearUsers() {
        this.view.searchList.innerHTML = '';
    }

    debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(this, args)
            }, delay)
        }
    }

}

new Search(new View())
