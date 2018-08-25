import { ServiceMessageModel } from '../models/service-message.model';
import { Service } from '../enums/service.enum';


abstract class Message {
    abstract get successMessage(): ServiceMessageModel;
    abstract get errorMessage(): ServiceMessageModel;
}


class LocalStorageMessage extends Message {
    get successMessage() {
        return {
            status: 2000,
            statusText: `Saved to local storage`,
            service: Service.LocalStorage
        };
    }
    get errorMessage() {
        return  {
            status: 2100,
            statusText: `Failed to save to local storage`,
            service: Service.LocalStorage
        };
    }
}

class GetExpiredArticlesMessage extends Message {
    get successMessage() {
        return {
            status: 2200,
            statusText: `Received expired articles`,
            service: Service.IndexedDb
        };
    }
    get errorMessage() {
        return{
            status: 2300,
            statusText: `Failed to retrieve expired articles`,
            service: Service.IndexedDb
        };
    }
}

class DeletedArticlesMessage extends Message {
    get successMessage() {
        return {
            status: 1100,
            statusText: `Saved articles`,
            service: Service.IndexedDb
        };
    }
    get errorMessage() {
        return {
            status: 1200,
            statusText: `Failed to save articles`,
            service: Service.IndexedDb
        };
    }
}

class SavedIndexedDbMessage extends Message {
    get successMessage() {
        return {
            status: 1200,
            statusText: `Deleted expired articles`,
            service: Service.IndexedDb
        };
    }
    get errorMessage() {
        return {
            status: 1300,
            statusText: `Failed to delete expired articles`,
            service: Service.IndexedDb
        };
    }
}

class NewsApiMessage extends Message {
    get successMessage() {
        return {
            status: 100,
            statusText: `Received articles`,
            service: Service.NewsAPI
        };
    }
    get errorMessage() {
        return {
            status: 200,
            statusText: `Failed to receive articles`,
            service: Service.NewsAPI
        };
    }
}

class CurrentAppStatus extends Message {
    get successMessage() {
        return {
            status: 1,
            statusText: `Received articles`,
            service: Service.AppStatus
        };
    }
    get errorMessage() {
        return {
            status: 2,
            statusText: `Failed to receive articles`,
            service: Service.AppStatus
        };
    }
}

export {
    LocalStorageMessage,
    GetExpiredArticlesMessage,
    DeletedArticlesMessage,
    SavedIndexedDbMessage,
    NewsApiMessage,
    CurrentAppStatus
};
