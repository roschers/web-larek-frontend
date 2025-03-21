import './scss/styles.scss';
import { App } from './components/app';
import { AppModel } from './components/model';
import { myApi } from './components/myApi';
import { ICardView } from './types';

const api = new myApi('https://cdn.example.com', 'https://api.example.com');
const model = new AppModel();
const app = new App(document.getElementById('app') as HTMLElement);

// Инициализация приложения
app.render();

// Обработка событий
api.getCardList().then((items: ICardView[]) => {
    model.setState({ catalog: items });
});

// Подписка на события
model.on('state:changed', () => {
    app.render();
});
