import { NewsSection } from '../../enums/news-section.enum';
import { NewsSectionModel } from '../../models/news-section.model';
import { newsSectionToObject } from './../utility/news-section.utility';

export class NewsSectionDefault {

    public get createAllNewsSections(): Map <string, NewsSectionModel> {

        const map = new Map();
        map.set(NewsSection.Business, newsSectionToObject(NewsSection.Business));
        map.set(NewsSection.Entertainment, newsSectionToObject(NewsSection.Entertainment));
        map.set(NewsSection.General, newsSectionToObject(NewsSection.General));
        map.set(NewsSection.Health, newsSectionToObject(NewsSection.Health));
        map.set(NewsSection.Science, newsSectionToObject(NewsSection.Science));
        map.set(NewsSection.Sports, newsSectionToObject(NewsSection.Sports));
        map.set(NewsSection.Technology, newsSectionToObject(NewsSection.Technology));

        return map;
    }

    get getDefaultSelectedNewsSections() {
        return new Set ([NewsSection.General, NewsSection.Science, NewsSection.Technology]);
    }

    get getDefaultViewingNewsSection() {
        return NewsSection.General;
    }
}
