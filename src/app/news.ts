
enum Category {
    Business = 'business',
    Entertainment = 'entertainment',
    General = 'general',
    Health = 'health',
    Science = 'science',
    Sports = 'sports',
    Technology = 'technology',
  }

  class News {
    constructor(
      readonly category: Category,
    ) { }
  }

  export { Category, News };
