------------------------------------faker-js: it is used to generate random data 1.
Basic Usage

After installation, import faker in your JavaScript/TypeScript file:

import { faker } from '@faker-js/faker';

// Generate a random name
console.log(faker.person.fullName());

// Generate a random email
console.log(faker.internet.email());

// Generate a random phone number
console.log(faker.phone.number());

\*\*\* Generate Localized Fake Data
Faker supports multiple languages and regions.

Example: Use French Data

import { fakerFR as faker } from '@faker-js/faker';

console.log(faker.person.fullName()); // "Élodie Dubois"
console.log(faker.location.city()); // "Marseille"

------------------------------------slugify: it is used to create SEO friendly URL like string.

// A slug is a human-readable, URL-friendly string that uniquely represents a piece of content. It is typically used in URLs instead of IDs or special characters.
// A car listing title: "2020 Toyota Corolla XLE" might be converted into a slug like: 2020-toyota-corolla-xle
// Why Use a Slug? SEO-Friendly URLs: example.com/car-listing/2020-toyota-corolla-xle Instead of example.com/car-listing/12345
// slugify(...): Converts the string into a URL-friendly format.
// What slugify does: Lowercases all characters ("Toyota" → "toyota").
// Replaces spaces with hyphens ("Corolla XLE" → "corolla-xle").
// Removes special characters ("$Toyota@123" → "toyota123").


------------------------------------thumbhash: this takes an image file converts into small string not base64 .
------------------------------------unlazy: this used to convert thumbhash's returns into base64 image.