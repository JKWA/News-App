 import { Observable, of } from 'rxjs';
 import { Service } from '../enums/service.enum';

function handleNewsErrors<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
        let userMessage: string;
        let service;
        console.log(error);
        switch (error.status) {
        case 200 :
            break;
        case 400 :
            userMessage = 'There was a problem with the news request';
            service = Service.NewsAPI;
            break;
        case 401 :
            userMessage = 'This was an unauthorized request';
            service = Service.NewsAPI;
            break;
        case 429 :
            userMessage = 'We are over the limit, please try again later';
            service = Service.NewsAPI;
            break;
        case 500 :
            userMessage = 'There was a problem with the news server, please try again later';
            service = Service.NewsAPI;
            break;
        case 0 :
            userMessage = 'offline';
            service = Service.NewsAPI;
            break;
        case 1100 :
            userMessage = 'There is no local database';
            service = Service.IndexedDb;
            break;
        case 1200 :
            userMessage = 'Indexed DB could not be opened and was reset';
            service = Service.IndexedDb;
            break;
        case 1300 :
            userMessage = `No index named ${error.statusText}`;
            service = Service.IndexedDb;
            break;
        case 1300 :
            userMessage = error.statusText;
            service = Service.IndexedDb;
            break;
        default :
        userMessage = `${error.statusText}`;
        }
        if ( userMessage ) {
        // this.store.dispatch(new AddError(service, userMessage));
        console.log(service, userMessage);
        }
        return of(result as T);
    };
}
export { handleNewsErrors };

