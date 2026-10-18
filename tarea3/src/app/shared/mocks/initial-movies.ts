import { Movie } from '../models/movie.model';

export const initialMovies: Movie[] = [
    {
      id: 'oppenheimer',
      title: 'Oppenheimer',
      originalTitle: 'Oppenheimer',
      year: 2023,
      duration: '3h 00m',
      durationMinutes: 180,
      rating: 4.9,
      ratingCount: '198k',
      genres: ['Drama', 'Historia', 'Ciencia Ficción'],
      director: 'Christopher Nolan',
      producer: 'Emma Thomas, Charles Roven',
      synopsis:
        'La historia del físico J. Robert Oppenheimer y su rol decisivo en el diseño de las primeras armas nucleares en el Proyecto Manhattan, desencadenando una era de dilemas éticos y científicos que cambiaron el curso de la humanidad.',
      posterUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDclqH2X9o6VrbzasQFoO9fArALy3cWbYZYh223Ay_0xEEDttzZeQhKrsaCXjGDEY4iqxbUqqqBiMnw396xkGFq6oIChBEX8_bUZZvwtfSMiAivKeyc_JpS6F6jsFRTkZm0PM8jwvZiv00yZdRIwhMFmxtjENvYJfb55nj8rrNjW0XmG9hENZ-h22-hv3Uk0Zdg0Z7cmO4z9rly53SWwzK-TL_b6WtUhvXN4IFJYOm-bwk6RnQbjTI',
      backdropUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDclqH2X9o6VrbzasQFoO9fArALy3cWbYZYh223Ay_0xEEDttzZeQhKrsaCXjGDEY4iqxbUqqqBiMnw396xkGFq6oIChBEX8_bUZZvwtfSMiAivKeyc_JpS6F6jsFRTkZm0PM8jwvZiv00yZdRIwhMFmxtjENvYJfb55nj8rrNjW0XmG9hENZ-h22-hv3Uk0Zdg0Z7cmO4z9rly53SWwzK-TL_b6WtUhvXN4IFJYOm-bwk6RnQbjTI',
      badges: ['IMAX', '4K Ultra HD', 'Dolby Atmos', 'Destacado'],
      isFeatured: true,
      cast: [
        {
          name: 'Cillian Murphy',
          role: 'J. Robert Oppenheimer',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAWq2YJwCt8SAcSw2-FrxBwQWZGPZIv8CHD5B4iWqIhiXycKn_0kC62AzwE0nuFMRCMSDN7iwC1OwwSi0bTKtTOlnd0tYg039oWcyI_RCZs0TMmCDyRS3qKsT3rUrxowMqoVuqUloNr6MZrsQhjOg_KE3rPqpzjmC41kQqiSzbj0yfMwoISFDS4AVHLuODLS3A3GHai8CpMnlPaCn0TwgvYNS1tSBKGph--kXmPtFFPWFp1ShsYrA4',
        },
        {
          name: 'Emily Blunt',
          role: 'Katherine Oppenheimer',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAPIjwiDmTq3sCqEMAGRNw1CvI_tO7gvyVYC-EcdhsIfWECs7o6SiucKZ_AO3WS0DRe5yjoeY3hV3POr9PYDFenRN4oF07F5MtpFqobxxBD78s-1VBU1mWNBXvzjzpoPJrsvWiJ1y1lpHO71axT4_Iy8kIyvDKbAsKOjptNlBkM7oXWOT-5rFBwxBrO-O-Ty17aHaD_CGJTwgZBtoYuulu9edq27jJODuOvFlw6B6lgd5ppkORigfU',
        },
        {
          name: 'Robert Downey Jr.',
          role: 'Lewis Strauss',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBMpSf-l2j33GdNUwHAoF-v4rUPOqnqWinTF9y69yV2IiIlL0fAk4Ddspb1_lNeOs6UJErEHggdPWstvDIZaaxLw6vpD4XM1iBH6if3Y4JFV0tNNwGUhxMfOFCtXqhBvEk-Vj2rdpyK3fixNs_O5c73L3a8YJyqvSidWtq26qsva-2Z8koO_7bjPzJSUeIlTF-e8kvT36wiZwhQsrihssxOwjxbrtyyXwl3Edav5ZKm_-9kLT0pt2Y',
        },
        {
          name: 'Matt Damon',
          role: 'Gral. Leslie Groves',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuD1n8NC8p_U6DJ7-kO43gZB_OzH01PW3ui40bVU7No77ifxlnDS4YR4Ieq8liiS1cy8M5VvLSoHJ6tdkZStytuQMgmoeXLEOd7eMSdjq0na6cXV-cUO6mEni3POZTYcdBrGvTkrCHr2aV8Zu1zgW4ejISzOJ5nR_Tq8S0ycsWNqQl1qKIhvMURkrjj5Wxshklg66UprcWNSj4O3nQiAUhbsdC60hX-sZ6xQcfZjtdJonCeCf90kxRY',
        },
      ],
      technicalSheet: {
        direction: 'Christopher Nolan',
        screenplay: 'Christopher Nolan',
        novel: 'American Prometheus: Kai Bird & Martin J. Sherwin',
        production: 'Emma Thomas, Charles Roven, Christopher Nolan',
        genre: 'Drama, Biográfico, Histórico',
        countryLanguage: 'EE. UU. / Inglés',
      },
    },
    {
      id: 'dune-2',
      title: 'Dune: Parte Dos',
      originalTitle: 'Dune: Part Two',
      year: 2024,
      duration: '2h 46m',
      durationMinutes: 166,
      rating: 8.9,
      ratingCount: '142k',
      genres: ['Ciencia Ficción', 'Aventura', 'Acción'],
      director: 'Denis Villeneuve',
      producer: 'Mary Parent, Cale Boyter',
      synopsis:
        'Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia. Ante la encrucijada entre el amor de su vida y el destino del universo entero, Paul emprende una cruzada para evitar un futuro terrible que solo él puede prever.',
      posterUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBIznlXM4uhEiLwu8PRtykaDFSPzhMiz8-iiNRe8npRnGfiPdWWLEfz6zW2AapgY8qL_NA6MGulZuO1t6DK9RFWVbXwYiyNGRonCuPolqFOiPW1qFlsF2oISHXVtZyfqTNRGjStAzNP4IFAhYd-9MjdysI0GDgm-5RB-rOCYmnfs6z-gnm-skXgRIVzNF8OlPOsH009BVvSV1hd_16Hjo8BY5HhnfGzOzkpCwG75ko5ew4OZPmJ-94',
      backdropUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDIC7lWjTpwcYYa1L5NvQC_euB7mOzpWCpmAHod99c8YEi9vwXzJdVHMCGDdkBv3nwKnQ16QDCA0VGUA9uQrEtWThT_Z1PVIW1UQD_n4HJ5PENaj7P-GBSl0sqVwgS7eFAw2vJKkb0Mp5q5TtGssseEBies_em2kodbfpv-eZJBvFf8iluNiSv9tx9_5qowWlEtGniAfUXpdWo7THizK2FKn94pwWno58qE4cxef9zJ4hZLJEe-Xyo',
      badges: ['IMAX', '4K Ultra HD', 'Dolby Atmos'],
      cast: [
        {
          name: 'Timothée Chalamet',
          role: 'Paul Atreides',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAWq2YJwCt8SAcSw2-FrxBwQWZGPZIv8CHD5B4iWqIhiXycKn_0kC62AzwE0nuFMRCMSDN7iwC1OwwSi0bTKtTOlnd0tYg039oWcyI_RCZs0TMmCDyRS3qKsT3rUrxowMqoVuqUloNr6MZrsQhjOg_KE3rPqpzjmC41kQqiSzbj0yfMwoISFDS4AVHLuODLS3A3GHai8CpMnlPaCn0TwgvYNS1tSBKGph--kXmPtFFPWFp1ShsYrA4',
        },
        {
          name: 'Zendaya',
          role: 'Chani',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAPIjwiDmTq3sCqEMAGRNw1CvI_tO7gvyVYC-EcdhsIfWECs7o6SiucKZ_AO3WS0DRe5yjoeY3hV3POr9PYDFenRN4oF07F5MtpFqobxxBD78s-1VBU1mWNBXvzjzpoPJrsvWiJ1y1lpHO71axT4_Iy8kIyvDKbAsKOjptNlBkM7oXWOT-5rFBwxBrO-O-Ty17aHaD_CGJTwgZBtoYuulu9edq27jJODuOvFlw6B6lgd5ppkORigfU',
        },
        {
          name: 'Rebecca Ferguson',
          role: 'Lady Jessica',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuD1n8NC8p_U6DJ7-kO43gZB_OzH01PW3ui40bVU7No77ifxlnDS4YR4Ieq8liiS1cy8M5VvLSoHJ6tdkZStytuQMgmoeXLEOd7eMSdjq0na6cXV-cUO6mEni3POZTYcdBrGvTkrCHr2aV8Zu1zgW4ejISzOJ5nR_Tq8S0ycsWNqQl1qKIhvMURkrjj5Wxshklg66UprcWNSj4O3nQiAUhbsdC60hX-sZ6xQcfZjtdJonCeCf90kxRY',
        },
        {
          name: 'Javier Bardem',
          role: 'Stilgar',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBMpSf-l2j33GdNUwHAoF-v4rUPOqnqWinTF9y69yV2IiIlL0fAk4Ddspb1_lNeOs6UJErEHggdPWstvDIZaaxLw6vpD4XM1iBH6if3Y4JFV0tNNwGUhxMfOFCtXqhBvEk-Vj2rdpyK3fixNs_O5c73L3a8YJyqvSidWtq26qsva-2Z8koO_7bjPzJSUeIlTF-e8kvT36wiZwhQsrihssxOwjxbrtyyXwl3Edav5ZKm_-9kLT0pt2Y',
        },
      ],
      technicalSheet: {
        direction: 'Denis Villeneuve',
        screenplay: 'Denis Villeneuve, Jon Spaihts',
        novel: 'Novela de Frank Herbert',
        production: 'Mary Parent, Cale Boyter, Tanya Lapointe',
        genre: 'Ciencia Ficción, Aventura, Drama',
        countryLanguage: 'EE. UU. / Inglés',
      },
    },
    {
      id: 'inception',
      title: 'Inception',
      originalTitle: 'Inception',
      year: 2010,
      duration: '2h 28m',
      durationMinutes: 148,
      rating: 8.8,
      ratingCount: '2.4M',
      genres: ['Ciencia Ficción', 'Acción', 'Suspense'],
      director: 'Christopher Nolan',
      producer: 'Emma Thomas',
      synopsis:
        'Un ladrón con la habilidad de infiltrarse en los sueños corporativos para extraer secretos acepta una misión casi imposible: implantar una idea en la mente de un magnate empresarial a cambio de volver con su familia.',
      posterUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDxKJcloZbDNRrMa-0po_zAdzbhhpUJ4HFgvLETfxSdDAPWWo0PuIoRqa3wYIcbJekKBz3w3if0sJ50mE-pi5MTqh6ZC5fe3pwepDvmS7Fx8Ry-h6EhuEb2x3DPH0kiKmgvaQb-NXOhyo8CJfePtPuZ8J8I5ktbihsP0J1orXcG-vyORq_wvQIZ6jsZWFouAj6hSEYeraglOXUYKRxyIxxuyjuzSVT0f78IMzWqo4Gfe_sBlveTCOU',
      backdropUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAQUFNLTD57MkGDfBGxhtGqhsy7JECH5Xjh6GY2z8jz3uPP3zkLp0aZ-LEXidTpY-r4Ol2IQlp2aH59hgaiLF3AI9kxsbO2yd-pAvbds7hzyOp_BuJzfxC5uhLm9PEAZaO0kO2gCGXv6hxde93wqRUW-G9TJedjmFRfv8RkYIlCxx-F0UiwGhwb5Et5droV6Q8M_rppVNaTJXcVW178VImnxFL1JGCD1t3esqB1_S6aDWepvI28TYk',
      badges: ['4K Ultra HD', 'Dolby Atmos'],
      cast: [
        {
          name: 'Leonardo DiCaprio',
          role: 'Dom Cobb',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAWq2YJwCt8SAcSw2-FrxBwQWZGPZIv8CHD5B4iWqIhiXycKn_0kC62AzwE0nuFMRCMSDN7iwC1OwwSi0bTKtTOlnd0tYg039oWcyI_RCZs0TMmCDyRS3qKsT3rUrxowMqoVuqUloNr6MZrsQhjOg_KE3rPqpzjmC41kQqiSzbj0yfMwoISFDS4AVHLuODLS3A3GHai8CpMnlPaCn0TwgvYNS1tSBKGph--kXmPtFFPWFp1ShsYrA4',
        },
        {
          name: 'Joseph Gordon-Levitt',
          role: 'Arthur',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBMpSf-l2j33GdNUwHAoF-v4rUPOqnqWinTF9y69yV2IiIlL0fAk4Ddspb1_lNeOs6UJErEHggdPWstvDIZaaxLw6vpD4XM1iBH6if3Y4JFV0tNNwGUhxMfOFCtXqhBvEk-Vj2rdpyK3fixNs_O5c73L3a8YJyqvSidWtq26qsva-2Z8koO_7bjPzJSUeIlTF-e8kvT36wiZwhQsrihssxOwjxbrtyyXwl3Edav5ZKm_-9kLT0pt2Y',
        },
        {
          name: 'Elliot Page',
          role: 'Ariadne',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAPIjwiDmTq3sCqEMAGRNw1CvI_tO7gvyVYC-EcdhsIfWECs7o6SiucKZ_AO3WS0DRe5yjoeY3hV3POr9PYDFenRN4oF07F5MtpFqobxxBD78s-1VBU1mWNBXvzjzpoPJrsvWiJ1y1lpHO71axT4_Iy8kIyvDKbAsKOjptNlBkM7oXWOT-5rFBwxBrO-O-Ty17aHaD_CGJTwgZBtoYuulu9edq27jJODuOvFlw6B6lgd5ppkORigfU',
        },
      ],
      technicalSheet: {
        direction: 'Christopher Nolan',
        screenplay: 'Christopher Nolan',
        production: 'Emma Thomas, Christopher Nolan',
        genre: 'Ciencia Ficción, Acción, Suspense',
        countryLanguage: 'EE. UU. / Inglés',
      },
    },
    {
      id: 'pulp-fiction',
      title: 'Pulp Fiction',
      originalTitle: 'Pulp Fiction',
      year: 1994,
      duration: '2h 34m',
      durationMinutes: 154,
      rating: 8.9,
      ratingCount: '2.1M',
      genres: ['Crimen', 'Suspense', 'Drama'],
      director: 'Quentin Tarantino',
      producer: 'Lawrence Bender',
      synopsis:
        'Las vidas de dos asesinos a sueldo de la mafia, una esposa de gánster enigmática y un boxeador en decadencia se entrelazan de forma impredecible en cuatro historias cargadas de humor negro, violencia y redención.',
      posterUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuASy05JjI-9L-C1EV-TBmEGzmxOM8pGhxCQIc0TochyE5xFfHqVB4R3ttZur9C0oIng4Y-Qbr1Ggg8JsQkIw2fpQ6qs03Hbxkhpyx4c00V6R6FVROr86NE7f30hhh-Yg1-84x2IAILKQ6rAXRpCIdee1y-EssIBwC6CjnLgO5c791CaolBZIhRrlJQKMNric9v1nv_MYf4AODyNCvnmsX5k7hIcgU3T5NTVliRReM-p3jdVOSeM6UA',
      backdropUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuASy05JjI-9L-C1EV-TBmEGzmxOM8pGhxCQIc0TochyE5xFfHqVB4R3ttZur9C0oIng4Y-Qbr1Ggg8JsQkIw2fpQ6qs03Hbxkhpyx4c00V6R6FVROr86NE7f30hhh-Yg1-84x2IAILKQ6rAXRpCIdee1y-EssIBwC6CjnLgO5c791CaolBZIhRrlJQKMNric9v1nv_MYf4AODyNCvnmsX5k7hIcgU3T5NTVliRReM-p3jdVOSeM6UA',
      badges: ['Clásico', 'Palme d’Or'],
      cast: [
        {
          name: 'John Travolta',
          role: 'Vincent Vega',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAWq2YJwCt8SAcSw2-FrxBwQWZGPZIv8CHD5B4iWqIhiXycKn_0kC62AzwE0nuFMRCMSDN7iwC1OwwSi0bTKtTOlnd0tYg039oWcyI_RCZs0TMmCDyRS3qKsT3rUrxowMqoVuqUloNr6MZrsQhjOg_KE3rPqpzjmC41kQqiSzbj0yfMwoISFDS4AVHLuODLS3A3GHai8CpMnlPaCn0TwgvYNS1tSBKGph--kXmPtFFPWFp1ShsYrA4',
        },
        {
          name: 'Samuel L. Jackson',
          role: 'Jules Winnfield',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBMpSf-l2j33GdNUwHAoF-v4rUPOqnqWinTF9y69yV2IiIlL0fAk4Ddspb1_lNeOs6UJErEHggdPWstvDIZaaxLw6vpD4XM1iBH6if3Y4JFV0tNNwGUhxMfOFCtXqhBvEk-Vj2rdpyK3fixNs_O5c73L3a8YJyqvSidWtq26qsva-2Z8koO_7bjPzJSUeIlTF-e8kvT36wiZwhQsrihssxOwjxbrtyyXwl3Edav5ZKm_-9kLT0pt2Y',
        },
        {
          name: 'Uma Thurman',
          role: 'Mia Wallace',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAPIjwiDmTq3sCqEMAGRNw1CvI_tO7gvyVYC-EcdhsIfWECs7o6SiucKZ_AO3WS0DRe5yjoeY3hV3POr9PYDFenRN4oF07F5MtpFqobxxBD78s-1VBU1mWNBXvzjzpoPJrsvWiJ1y1lpHO71axT4_Iy8kIyvDKbAsKOjptNlBkM7oXWOT-5rFBwxBrO-O-Ty17aHaD_CGJTwgZBtoYuulu9edq27jJODuOvFlw6B6lgd5ppkORigfU',
        },
      ],
      technicalSheet: {
        direction: 'Quentin Tarantino',
        screenplay: 'Quentin Tarantino, Roger Avary',
        production: 'Lawrence Bender',
        genre: 'Crimen, Drama, Suspense',
        countryLanguage: 'EE. UU. / Inglés',
      },
    },
    {
      id: 'spider-verse',
      title: 'Spider-Man: Across the Spider-Verse',
      originalTitle: 'Spider-Man: Across the Spider-Verse',
      year: 2023,
      duration: '2h 20m',
      durationMinutes: 140,
      rating: 8.7,
      ratingCount: '410k',
      genres: ['Animación', 'Acción', 'Aventura'],
      director: 'Joaquim Dos Santos, Kemp Powers',
      producer: 'Phil Lord, Christopher Miller',
      synopsis:
        'Miles Morales es catapultado a través del Multiverso, donde choca de frente con un equipo de élite de héroes arácnidos de distintas realidades encargados de proteger la existencia misma de los universos conectados.',
      posterUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB20tTHsAebsr5XBcdW9EOBv5u4hQKdRXktWh8QFmSLd5NoUQxG2-HzwO2MQNyMwxt3JYRxu0ayiuQ9YUu_BYsS-wWdut-AGkLo9eh5tPHF7Hg0eCSB-ElB6ugjzyL99jwRkNwsGe-VhpvqBk9M6TVY9YcJA2O7_A5SZCJK_TdSflajIcxTmkWAaq1F1PZdmKPI9Fwt-D7t8Dsvyvd_FqXTF9sJobuxHOLDfXtEMN7UzMCBsCj4sok',
      backdropUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB20tTHsAebsr5XBcdW9EOBv5u4hQKdRXktWh8QFmSLd5NoUQxG2-HzwO2MQNyMwxt3JYRxu0ayiuQ9YUu_BYsS-wWdut-AGkLo9eh5tPHF7Hg0eCSB-ElB6ugjzyL99jwRkNwsGe-VhpvqBk9M6TVY9YcJA2O7_A5SZCJK_TdSflajIcxTmkWAaq1F1PZdmKPI9Fwt-D7t8Dsvyvd_FqXTF9sJobuxHOLDfXtEMN7UzMCBsCj4sok',
      badges: ['Animación', '4K HDR', 'Dolby Atmos'],
      cast: [
        {
          name: 'Shameik Moore',
          role: 'Miles Morales (voz)',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAWq2YJwCt8SAcSw2-FrxBwQWZGPZIv8CHD5B4iWqIhiXycKn_0kC62AzwE0nuFMRCMSDN7iwC1OwwSi0bTKtTOlnd0tYg039oWcyI_RCZs0TMmCDyRS3qKsT3rUrxowMqoVuqUloNr6MZrsQhjOg_KE3rPqpzjmC41kQqiSzbj0yfMwoISFDS4AVHLuODLS3A3GHai8CpMnlPaCn0TwgvYNS1tSBKGph--kXmPtFFPWFp1ShsYrA4',
        },
        {
          name: 'Hailee Steinfeld',
          role: 'Gwen Stacy (voz)',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAPIjwiDmTq3sCqEMAGRNw1CvI_tO7gvyVYC-EcdhsIfWECs7o6SiucKZ_AO3WS0DRe5yjoeY3hV3POr9PYDFenRN4oF07F5MtpFqobxxBD78s-1VBU1mWNBXvzjzpoPJrsvWiJ1y1lpHO71axT4_Iy8kIyvDKbAsKOjptNlBkM7oXWOT-5rFBwxBrO-O-Ty17aHaD_CGJTwgZBtoYuulu9edq27jJODuOvFlw6B6lgd5ppkORigfU',
        },
      ],
      technicalSheet: {
        direction: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson',
        screenplay: 'Phil Lord, Christopher Miller, Dave Callaham',
        production: 'Phil Lord, Christopher Miller, Amy Pascal',
        genre: 'Animación, Superhéroes, Ciencia Ficción',
        countryLanguage: 'EE. UU. / Inglés',
      },
    },
    {
      id: 'interstellar',
      title: 'Interstellar',
      originalTitle: 'Interstellar',
      year: 2014,
      duration: '2h 49m',
      durationMinutes: 169,
      rating: 8.7,
      ratingCount: '2.0M',
      genres: ['Ciencia Ficción', 'Drama', 'Aventura'],
      director: 'Christopher Nolan',
      producer: 'Emma Thomas, Lynda Obst',
      synopsis:
        'Cuando la Tierra enfrenta la inminente extinción de sus recursos, un valiente equipo de astronautas y científicos emprende el viaje más trascendental en la historia humana a través de un agujero de gusano para hallar un nuevo hogar.',
      posterUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDjvD1VTMwrgh8mP4_zEmEGFuURTYcynq7CgI2YGa5-GVEz9CJREzTZHKA7IXa4QnEPSRZFcawMXu0CJnjG7ASi9fLHyQ6UhW4dttJxQ20IdjbP333SfgQzhV2T_hQjNjg6zk-AxpAa453Fy35UtajKy4RyuK9zpmXKqyR9uz7TXeG1a8pUsJu0nHXlYSapi--xkGV5NqOpTB682E66v_3uTnyHyHgUYW1cS7s0O3dvKGUCZN9wMB8',
      backdropUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAHH-OUc87GWiuBT7Z6-zCx9x4uVZ76gA32bp-pDAHf7El7e9K3Q-SaiJ-FGZ803fsBENh_R-f7LP0sNX-gmuOYK2JjgVo3-sO7zhvCmrTUl1sljYDWNQpCiYhmJoF657-33_ZqkEaRXlmgKTmnq6ZmN4QuLbHfyUCekA0RLeBshkS5z6mXX5C3ZPrFVABf0Klw0UgOZUDD05edDuMDzMuFmJUnSIvBoaC33QbNF71r7cr1K9Ailk0',
      badges: ['IMAX', 'Sci-Fi Masterpiece'],
      cast: [
        {
          name: 'Matthew McConaughey',
          role: 'Joseph Cooper',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAWq2YJwCt8SAcSw2-FrxBwQWZGPZIv8CHD5B4iWqIhiXycKn_0kC62AzwE0nuFMRCMSDN7iwC1OwwSi0bTKtTOlnd0tYg039oWcyI_RCZs0TMmCDyRS3qKsT3rUrxowMqoVuqUloNr6MZrsQhjOg_KE3rPqpzjmC41kQqiSzbj0yfMwoISFDS4AVHLuODLS3A3GHai8CpMnlPaCn0TwgvYNS1tSBKGph--kXmPtFFPWFp1ShsYrA4',
        },
        {
          name: 'Anne Hathaway',
          role: 'Dra. Amelia Brand',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAPIjwiDmTq3sCqEMAGRNw1CvI_tO7gvyVYC-EcdhsIfWECs7o6SiucKZ_AO3WS0DRe5yjoeY3hV3POr9PYDFenRN4oF07F5MtpFqobxxBD78s-1VBU1mWNBXvzjzpoPJrsvWiJ1y1lpHO71axT4_Iy8kIyvDKbAsKOjptNlBkM7oXWOT-5rFBwxBrO-O-Ty17aHaD_CGJTwgZBtoYuulu9edq27jJODuOvFlw6B6lgd5ppkORigfU',
        },
        {
          name: 'Jessica Chastain',
          role: 'Murphy Cooper',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuD1n8NC8p_U6DJ7-kO43gZB_OzH01PW3ui40bVU7No77ifxlnDS4YR4Ieq8liiS1cy8M5VvLSoHJ6tdkZStytuQMgmoeXLEOd7eMSdjq0na6cXV-cUO6mEni3POZTYcdBrGvTkrCHr2aV8Zu1zgW4ejISzOJ5nR_Tq8S0ycsWNqQl1qKIhvMURkrjj5Wxshklg66UprcWNSj4O3nQiAUhbsdC60hX-sZ6xQcfZjtdJonCeCf90kxRY',
        },
      ],
      technicalSheet: {
        direction: 'Christopher Nolan',
        screenplay: 'Jonathan Nolan, Christopher Nolan',
        production: 'Emma Thomas, Christopher Nolan, Lynda Obst',
        genre: 'Ciencia Ficción, Drama, Aventura',
        countryLanguage: 'EE. UU. / Inglés',
      },
    },
    {
      id: 'parasite',
      title: 'Parasite',
      originalTitle: 'Gisaengchung',
      year: 2019,
      duration: '2h 12m',
      durationMinutes: 132,
      rating: 8.5,
      ratingCount: '920k',
      genres: ['Drama', 'Suspense', 'Comedia Negra'],
      director: 'Bong Joon-ho',
      producer: 'Kwak Sin-ae, Moon Yang-kwon',
      synopsis:
        'La avaricia y la discriminación de clases amenazan la recién formada relación simbiótica entre la adinerada familia Park y el empobrecido clan Kim, con giros estremecedores que exponen las grietas del tejido social.',
      posterUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuADQxi9MYQksONBlAFoffVaLffFxfH4cujCrJAxtOde3TiWmTa_AimwbwE3XCqvwQlysgmlCd7nicfyBuIwCHrofewtgIBIx6I5o1GxyG3pOEtEzWlg2D3-ZE-rvjf68TC5CoYoEvzZeJaogpV0l68J6VoEVmGFuRg6k33V5EBJogZbqbMTtjDbNO3RM_GfLQvJ8ewGlNadPtKl7f3DX9Bt8EAFJkHZ6kGnKadarghtUb-96AOBSW4',
      backdropUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuADQxi9MYQksONBlAFoffVaLffFxfH4cujCrJAxtOde3TiWmTa_AimwbwE3XCqvwQlysgmlCd7nicfyBuIwCHrofewtgIBIx6I5o1GxyG3pOEtEzWlg2D3-ZE-rvjf68TC5CoYoEvzZeJaogpV0l68J6VoEVmGFuRg6k33V5EBJogZbqbMTtjDbNO3RM_GfLQvJ8ewGlNadPtKl7f3DX9Bt8EAFJkHZ6kGnKadarghtUb-96AOBSW4',
      badges: ['Oscar Ganador', 'Palme d’Or'],
      cast: [
        {
          name: 'Song Kang-ho',
          role: 'Kim Ki-taek',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAWq2YJwCt8SAcSw2-FrxBwQWZGPZIv8CHD5B4iWqIhiXycKn_0kC62AzwE0nuFMRCMSDN7iwC1OwwSi0bTKtTOlnd0tYg039oWcyI_RCZs0TMmCDyRS3qKsT3rUrxowMqoVuqUloNr6MZrsQhjOg_KE3rPqpzjmC41kQqiSzbj0yfMwoISFDS4AVHLuODLS3A3GHai8CpMnlPaCn0TwgvYNS1tSBKGph--kXmPtFFPWFp1ShsYrA4',
        },
        {
          name: 'Choi Woo-shik',
          role: 'Kim Ki-woo',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBMpSf-l2j33GdNUwHAoF-v4rUPOqnqWinTF9y69yV2IiIlL0fAk4Ddspb1_lNeOs6UJErEHggdPWstvDIZaaxLw6vpD4XM1iBH6if3Y4JFV0tNNwGUhxMfOFCtXqhBvEk-Vj2rdpyK3fixNs_O5c73L3a8YJyqvSidWtq26qsva-2Z8koO_7bjPzJSUeIlTF-e8kvT36wiZwhQsrihssxOwjxbrtyyXwl3Edav5ZKm_-9kLT0pt2Y',
        },
      ],
      technicalSheet: {
        direction: 'Bong Joon-ho',
        screenplay: 'Bong Joon-ho, Han Jin-won',
        production: 'Kwak Sin-ae, Moon Yang-kwon',
        genre: 'Drama, Suspense, Comedia Negra',
        countryLanguage: 'Corea del Sur / Coreano',
      },
    },
  ];
