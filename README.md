# Lipiq

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

## Comment fonctionne le score

Chaque produit part d'un score de 0. Chaque critère ajoute ou retire des points, puis le score final donne le statut.

```mermaid
flowchart TD
    A["Produit Open Food Facts"] --> B{"Graisses saturées renseignées ?"}
    B -- non --> G["Gris : données insuffisantes"]
    B -- oui --> C["Graisses saturées (100 g)<br/>plus de 5 g : +3 | dès 1,5 g : +1"]
    C --> D["Huiles à risque<br/>palme, coco, hydrogéné : +2"]
    D --> E["Gras trans<br/>plus de 0,5 g : +2"]
    E --> F["Sucres<br/>plus de 22,5 g : +1"]
    F --> H["Fibres (bonus)<br/>dès 6 g : -2 | dès 3 g : -1"]
    H --> I["Garde-fou<br/>saturés dès 1,5 g : score au moins 1"]
    I --> V["Favorable<br/>score ≤ 0"]
    I --> O["À limiter<br/>score 1 à 2"]
    I --> R["Déconseillé<br/>score ≥ 3"]

    classDef gray fill:#f1efe8,stroke:#5f5e5a,color:#2c2c2a
    classDef add fill:#eeedfe,stroke:#534ab7,color:#26215c
    classDef bonus fill:#e1f5ee,stroke:#0f6e56,color:#04342c
    classDef ok fill:#eaf3de,stroke:#3b6d11,color:#173404
    classDef mid fill:#faeeda,stroke:#854f0b,color:#412402
    classDef bad fill:#fcebeb,stroke:#a32d2d,color:#501313

    class A,B,G,I gray
    class C,D,E,F add
    class H bonus
    class V ok
    class O mid
    class R bad
```

| Score final | Statut      |
| ----------- | ----------- |
| 0 ou moins  | Favorable   |
| 1 à 2       | À limiter   |
| 3 ou plus   | Déconseillé |

> Indication générale, elle ne remplace pas un avis médical.
