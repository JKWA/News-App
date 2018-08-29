import { NewsSection } from '../../enums/news-section.enum';

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
export function stringToNewsSection(cat: string): NewsSection {
    let returnCat;

      switch (cat) {
        case 'business' :
          returnCat = NewsSection.Business;
          break;
        case 'entertainment' :
          returnCat = NewsSection.Entertainment;
          break;
        case 'general' :
          returnCat = NewsSection.General;
          break;
        case 'health' :
          returnCat = NewsSection.Health;
          break;
        case 'science' :
          returnCat = NewsSection.Science;
          break;
        case 'sports' :
          returnCat = NewsSection.Sports;
        break;
          case 'technology' :
          returnCat = NewsSection.Technology;
          break;
        default :
        returnCat = NewsSection.General;
      }

    return returnCat;

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
    export function newsSectionToObject(section: NewsSection): NewsSectionItem {
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

