export interface Product {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    author: string;
    category: string;
    edition: string;
    price: number;
    description: string;
    image: string;
    pages: number;
    binding: string;
}

export const products: Product[] = [
    {
        id: "prod_01",
        slug: "before-the-coffee-gets-cold",
        title: "Before the Coffee Gets Cold",
        subtitle: "A poignant tale of time and regret.",
        author: "Toshikazu Kawaguchi",
        category: "Fiction",
        edition: "001",
        price: 3500,
        description: "In a small back alley in Tokyo, there is a café which has been serving carefully brewed coffee for more than one hundred years. But this coffee shop offers its customers a unique experience: the chance to travel back in time. With the signature Japanese blend of magical realism and poignant 'slice of life', this novel is a heartwarming story about the importance of our present.",
        image: "/images/book-0.jpg",
        pages: 224,
        binding: "Hardcover Edition"
    },
    {
        id: "prod_02",
        slug: "meditations-on-silence",
        title: "Meditations on Silence",
        subtitle: "A study in minimalist philosophy.",
        author: "Elias Thorne",
        category: "Philosophy",
        edition: "001",
        price: 4200,
        description: "In a world defined by the relentless hum of digital noise, Elias Thorne invites the reader into a sanctuary of intentional stillness. Meditations on Silence is not merely a collection of essays; it is a curriculum for the modern soul. Through poetic prose and philosophical rigor, Thorne explores the weight of unspoken words, the architecture of quiet spaces, and the profound liberation found when one finally learns to listen to the void.",
        image: "/images/image.webp",
        pages: 312,
        binding: "Linen Bound"
    },
    {
        id: "prod_03",
        slug: "the-weavers-tale",
        title: "The Weaver's Tale",
        subtitle: "A timeless narrative of craftsmanship.",
        author: "Amara Vance",
        category: "Fiction",
        edition: "004",
        price: 3800,
        description: "The story of a master weaver whose threads connect the past to the present. A profound look at how we build our lives and how we are bound together by the stories we tell.",
        image: "/images/image-1.webp",
        pages: 416,
        binding: "Special Edition"
    },
    {
        id: "prod_04",
        slug: "whispers-of-the-coast",
        title: "Whispers of the Coast",
        subtitle: "A modern collection of geometric poetry.",
        author: "Sienna Lake",
        category: "Poetry",
        edition: "009",
        price: 3400,
        description: "Experimental poetry that captures the essence of the shoreline through abstract forms. Each poem is a geometric reflection on the movement of water and light.",
        image: "/images/image-2.webp",
        pages: 184,
        binding: "Limited Softcover"
    }
];

export function getProduct(slug: string) {
    return products.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
    return products.find((p) => p.id === id);
}