import { ServiceMessageModel } from '../models/service-message.model';
import { Service } from '../enums/service.enum';



class Message {
    public  successMessage: ServiceMessageModel;
    public  errorMessage: ServiceMessageModel;
    constructor (_successMessage, _errorMessage) {
        this.successMessage = _successMessage;
        this.errorMessage = _errorMessage;
    }
}

class LocalStorageMessage extends Message {
    constructor() {
        super(
            {
                status: 2000,
                statusText: `Saved to local storage`,
                service: Service.LocalStorage
            },
            {
                status: 2100,
                statusText: `Failed to save to local storage`,
                service: Service.LocalStorage
            }
        );
    }
}

class GetExpiredArticlesMessage extends Message {
    constructor() {
        super(
            {
                status: 1000,
                statusText: `Received expired articles`,
                service: Service.IndexedDb
            },
            {
                status: 1100,
                statusText: `Failed to retrieve expired articles`,
                service: Service.IndexedDb
            }
        );
    }
}

class DeletedArticlesMessage extends Message {
    constructor() {
        super(
            {
                status: 1200,
                statusText: `Deleted expired articles`,
                service: Service.IndexedDb
            },
            {
                status: 1300,
                statusText: `Failed to delete expired articles`,
                service: Service.IndexedDb
            }
        );
    }
}

export { LocalStorageMessage, GetExpiredArticlesMessage, DeletedArticlesMessage };
