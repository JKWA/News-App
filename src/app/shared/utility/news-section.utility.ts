import { NewsSection } from '../../enums/news-section.enum';
import { NewsSectionModel } from '../../models/news-section.model';

export interface NewsSectionItem {
    display: string;
    id: string;
    selected: boolean;
  }

/**
 * transforms a string to a section enum
 *
 * @export
 * @param {string} cat
 * @returns {NewsSection}
 */
export function stringToNewsSection(section: string): NewsSection {
    let returnSection;

      switch (section) {
        case 'business' :
          returnSection = NewsSection.Business;
          break;
        case 'entertainment' :
          returnSection = NewsSection.Entertainment;
          break;
        case 'general' :
          returnSection = NewsSection.General;
          break;
        case 'health' :
          returnSection = NewsSection.Health;
          break;
        case 'science' :
          returnSection = NewsSection.Science;
          break;
        case 'sports' :
          returnSection = NewsSection.Sports;
        break;
          case 'technology' :
          returnSection = NewsSection.Technology;
          break;
        default :
        returnSection = NewsSection.General;
      }

    return returnSection;

  }

  /**
   * transforms a comma seperated string to a set of section enums
   *
   * @export
   * @param {string} cat
   * @returns {Set<NewsSection>}
   */
  export function stringToNewsSections(cat: string): Set<NewsSection> {
      const sectionSet = new Set();
      cat.split(',').map(section => {
        sectionSet.add(stringToNewsSection(section));
      });
      return sectionSet;

    }

    /**
     * transforms section enum to an NewsSectionItem
     *
     * @export
     * @param {NewsSection} section
     * @returns {NewsSectionItem}
     */
    export function newsSectionToObject(section: NewsSection): NewsSectionModel {
      let sectionObj;
      switch (section) {
        case NewsSection.Science :
          sectionObj = {
            display: 'Science',
            id: 'science'
          };
          break;
          case NewsSection.Business :
            sectionObj = {
              display: 'Business',
              id: 'business'
            };
            break;
          case NewsSection.Entertainment :
          sectionObj = {
            display: 'Entertainment',
            id: 'entertainment'
          };
          break;
          case NewsSection.General :
          sectionObj = {
            display: 'General',
            id: 'general'
          };
          break;
          case NewsSection.Health :
          sectionObj = {
            display: 'Health',
            id: 'health'
          };
          break;
        case NewsSection.Science :
          sectionObj = {
            display: 'Science',
            id: 'science'
          };
          break;
        case NewsSection.Sports :
          sectionObj = {
            display: 'Sports',
            id: 'sports'
          };
          break;
        case NewsSection.Technology :
          sectionObj = {
            display: 'Technology',
            id: 'technology'
          };
          break;
        default :
        sectionObj = {
          display: 'Other',
          id: 'general'
        };
      }
      sectionObj.selected = false;
      return sectionObj;
    }

/* tslint:disable-next-line */
export function setSelectedNewsSections(viewedNewsSection: Set<NewsSection>, allNewsSections: Map<string, NewsSectionModel>): Map<string, NewsSectionModel> {
    viewedNewsSection.forEach(selectedNewsSection => {
      allNewsSections.set(selectedNewsSection, {...allNewsSections.get(selectedNewsSection), selected: true});
    });
    // allNewsSections.forEach( section => {
    //   if (viewedNewsSection.has(stringToNewsSection(section.id))) {
    //     section.selected = true;
    //   } else {
    //     section.selected = false;
    //   }
    // });
    return allNewsSections;
}

