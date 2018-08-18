/* tslint:disable */
import { Article } from '../app/models/article.model';
export function getArticles(): Article[]{
    return [
    {
    source: {
    id: null,
    name: "Latimes.com"
    },
    author: "Russ Mitchell",
    title: "Is he PT Barnum or Albert Einstein? Two views on Musk's plan to take Tesla private",
    description: "Two financial industry professionals argue for and against Elon Musk's plan to take Tesla private and share different opinions on the CEO's motivations.",
    url: "http://www.latimes.com/business/autos/lafihyteslaopposingviews20180808story.html",
    urlToImage: "http://www.latimes.com/resizer/rUsJqC1N3YCknnTWO9vgm_RJ1eQ=/1200x0/arcanglerfisharc2prodtronc.s3.amazonaws.com/public/TR4CUFCY75GXHA4Q5ARW6BVGLU.jpg",
    publishedAt: "20180808T22:37:43Z",
    id: 'id1'
    },
    {
    source: {
    id: null,
    name: "Orlandosentinel.com"
    },
    author: "David Harris, Tiffini Theisen",
    title: "Unaccompanied children on Frontier flight to Orlando ended up in hotel room with airline employee, family says",
    description: "The father of the 9 and 7yearold said the whole situation was mishandled and he still hasn’t heard from the airline.",
    url: "http://www.orlandosentinel.com/news/osflightdivertedunaccompaniedminors20180808story.html",
    urlToImage: "http://www.trbimg.com/img5b6b7029/turbine/osflightdivertedunaccompaniedminors20180808",
    publishedAt: "20180808T22:10:00Z",
    id: "id2"
    },
    {
    source: {
    id: "thenewyorktimes",
    name: "The New York Times"
    },
    author: "http://www.nytimes.com/by/nirajchokshi",
    title: "Asbestos in a Crayon, Benzene in a Marker: A School Supply Study's Toxic Results",
    description: "A public interest group tested 27 backtoschool products and found dangerous chemicals in four of them.",
    url: "https://www.nytimes.com/2018/08/08/education/asbestoscrayonsschoolsupplies.html",
    urlToImage: "https://static01.nyt.com/images/2018/08/09/business/09xptoxins/09xptoxinsfacebookJumbo.jpg",
    publishedAt: "20180808T21:53:12Z",
    id: "id3"
    },
    ];
}