import api from './api';


class App {
    constructor(){
        this.repositories = [];

        this.formEl = document.getElementById('repo-form');
        this.inputEl = document.querySelector('input[name=repository]');
        this.listEl = document.getElementById('repo-list');

        this.bindEvents();
    }


    bindEvents(){
        this.formEl.onsubmit = event => this.addRepository(event);
    }

    async addRepository(event){
        event.preventDefault();

        const repoInput = this.inputEl.value;
        
        if(repoInput.length === 0) return;

        try {
            let loading = document.createElement('p');
            loading.appendChild(document.createTextNode('carregando...'));
            this.formEl.after(loading);

            const response = await api.get(`/repos/${repoInput}`);
            const {name, description, owner: {avatar_url}, html_url} = response.data;

            this.repositories.push({
                name,
                description,
                html_url,
                avatar_url
            });

            this.inputEl.value = '';

            this.render();


            loading.remove()
        } catch(err) {
            console.warn('Ero na api -> ', err);
        }
    }

    render(){
        this.listEl.innerHTML = '';


        // só percorre.. o map não, o map retorna algum item
        this.repositories.forEach(repo => {
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            let titleEl = document.createElement('strong');
            titleEl.appendChild(document.createTextNode(repo.name));

            let descriptionEl = document.createElement('p');
            descriptionEl.appendChild(document.createTextNode(repo.description));

            let linkEl = document.createElement('a');
            linkEl.setAttribute('target', '_blank');
            linkEl.setAttribute('href', repo.html_url);
            linkEl.appendChild(document.createTextNode('Acessar'));


            let listItemEl = document.createElement('li');
            listItemEl.appendChild(imgEl);
            listItemEl.appendChild(titleEl);
            listItemEl.appendChild(descriptionEl);
            listItemEl.appendChild(linkEl);

            this.listEl.appendChild(listItemEl);

        });
    }
}


new App();