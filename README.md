
# 🦸 SuperHeroes App

  

Una aplicación móvil React Native que permite explorar, gestionar y crear equipos de superhéroes con funcionalidades offline y autenticación biométrica.

  

## 📋 Tabla de Contenidos

  

- [Requisitos](#-requisitos)

- [Instalación](#-instalación)

- [Ejecución](#-ejecución)

- [Arquitectura](#-arquitectura)

- [Funcionalidades](#-funcionalidades)

- [Cálculo de Power Score](#-cálculo-de-power-score)

- [Capturas de Pantalla](#-capturas-de-pantalla)

- [Plan de Optimizaciones](#-plan-de-optimizaciones)

- [Tecnologías Utilizadas](#-tecnologías-utilizadas)

- [Estructura del Proyecto](#-estructura-del-proyecto)

  

## 🎯 Requisitos

  

### Funcionalidades Principales

-  **Lista de Superhéroes**: Visualización de todos los superhéroes con búsqueda en tiempo real

-  **Detalle de Superhéroe**: Vista detallada con estadísticas de poder y información completa

-  **Sistema de Favoritos**: Marcar/desmarcar superhéroes como favoritos con persistencia local

-  **Gestión de Equipos**: Crear, editar y gestionar equipos de superhéroes

-  **Autenticación Biométrica**: Protección de equipos con huella dactilar/face ID

-  **Funcionalidad Offline**: La app funciona sin conexión a internet usando base de datos local

  

### Requisitos Técnicos

-  **React Native 0.81.1**

-  **Node.js v20.19.4**

-  **Android SDK** (para desarrollo Android)

-  **Dispositivo con sensor biométrico** 

  

## 🚀 Instalación

  

1.  **Clonar el repositorio**

```bash

git  clone https://github.com/bsicay/SuperHeroes-App-test.git

cd  superheroes

```

  

2.  **Instalar dependencias**

```bash

npm  install

```

  
  

4.  **Configurar dependencias nativas (iOS)**

```bash

cd  ios

pod  install

cd  ..

```

  

## Ejecución

  

### Android

```bash

npm run android

```


##  Arquitectura

  

La aplicación sigue los principios de **Clean Architecture** y **Feature-First Architecture**:

  

### Patrones Implementados

  

#### 1. **Feature-First Architecture**

```

src/

├── features/

│ ├── heroes/ # Módulo de superhéroes

│ ├── favorites/ # Módulo de favoritos

│ ├── teams/ # Módulo de equipos

│ └── splash/ # Módulo de splash screen

```

  

#### 2. **Repository Pattern**

-  **HeroesRepository**: Gestión de datos de superhéroes

-  **TeamsRepository**: Gestión de datos de equipos

-  **Database**: Capa de abstracción para SQLite

  

#### 3. **Service Layer Pattern**

-  **BiometricAuth**: Servicio de autenticación biométrica

-  **API Services**: Servicios para comunicación con APIs externas

  

#### 4. **Context Pattern**

-  **FavoritesContext**: Estado global para favoritos

-  **Inyección de dependencias implícita** a través de contextos

  

#### 5. **Custom Hooks Pattern**

-  **useHeroesOffline**: Gestión de héroes con funcionalidad offline

-  **useFavoritesOffline**: Gestión de favoritos

-  **useTeamsOffline**: Gestión de equipos

-  **useApiFetch**: Hook base para peticiones HTTP

  

### Capas de la Arquitectura

  

```

┌─────────────────────────────────────┐

│ Presentation Layer │

│ (Screens, Components, Navigation) │

├─────────────────────────────────────┤

│ Business Layer │

│ (Hooks, Context, Services) │

├─────────────────────────────────────┤

│ Data Layer │

│ (Repositories, Database, API) │

└─────────────────────────────────────┘

```

  
##  Cálculo de Power Score


  

### Fórmula de Cálculo

  

```typescript

Power Score =  Σ(Stat × Weight) /  Σ(Weights)

```

  

### Pesos Asignados

-  **Intelligence**: 1.2x (Más importante para estrategia)

-  **Strength**: 1.0x (Peso base)

-  **Speed**: 1.0x (Peso base)

-  **Durability**: 1.0x (Peso base)

-  **Power**: 1.3x (Más importante para combate)

-  **Combat**: 1.1x (Importante para habilidades de pelea)

  

### Ejemplo de Cálculo

```

Superman:

- Intelligence: 94 × 1.2 = 112.8

- Strength: 100 × 1.0 = 100.0

- Speed: 100 × 1.0 = 100.0

- Durability: 100 × 1.0 = 100.0

- Power: 100 × 1.3 = 130.0

- Combat: 85 × 1.1 = 93.5

  

Total Weighted: 636.3

Total Weights: 6.6

Power Score: 636.3 / 6.6 = 96.4 ≈ 96

```

  

### Manejo de Valores Especiales

-  **"null"** → 0

-  **"infinite"** → 100

-  **Valores inválidos** → 0

-  **Límite máximo** → 100

  

## Capturas de Pantalla

  

| ![img1](https://github.com/user-attachments/assets/d7c17c1b-437d-4fd9-9970-11f750531f57) | ![img2](https://github.com/user-attachments/assets/98536167-f40f-4e76-a122-7eab890da733) |
|------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| ![img3](https://github.com/user-attachments/assets/35467677-3345-45a3-a8f8-67a11f3bcd0c) | ![img4](https://github.com/user-attachments/assets/a5edad71-a175-4a6f-abc4-2b8c3e736afd) |
| ![img5](https://github.com/user-attachments/assets/af5a5725-62b8-4201-9996-c9e0d3803e82) | ![img6](https://github.com/user-attachments/assets/fdefe415-59a4-4e3a-902c-cab2ac5ff15f) |
| ![img7](https://github.com/user-attachments/assets/a18b1d97-e334-4599-b1e5-a699dab3b220) | ![img8](https://github.com/user-attachments/assets/736152d4-b8a0-47c2-93ad-5b267f937dc2) |

## Plan de Optimizaciones

  

### Escalabilidad para Más Superhéroes

  

#### 1. **Paginación y Lazy Loading**

```typescript

// Implementar paginación en la API

const  usePaginatedHeroes  = (page:  number, limit:  number) => {

// Cargar héroes por lotes

// Implementar infinite scroll

// Cache inteligente por páginas

};

```



#### 2. **Base de Datos Optimizada**

```sql

-- Índices adicionales para búsquedas rápidas

CREATE  INDEX  idx_heroes_power_score  ON heroes(powerScore);

CREATE  INDEX  idx_heroes_alignment  ON heroes(biography_alignment);

CREATE  INDEX  idx_heroes_publisher  ON heroes(biography_publisher);

  

-- Particionado por rangos de poder

CREATE  TABLE  heroes_high_power  AS

SELECT  *  FROM heroes WHERE powerScore >  80;

```

  

#### 3. **Cache Inteligente**

```typescript

// Implementar cache con TTL

const cacheConfig = {

heroes: { ttl:  3600000 }, // 1 hora

favorites: { ttl:  86400000 }, // 24 horas

teams: { ttl:  86400000 }, // 24 horas

};

```

  

### Optimizaciones de Rendimiento

  

#### 1. **Memoización de Componentes**

```typescript

const HeroCard = React.memo(({ hero, onPress, onToggleFavorite }) => {

// Componente optimizado

}, (prevProps, nextProps) => {

return prevProps.hero.id === nextProps.hero.id &&

prevProps.hero.isFavorite === nextProps.hero.isFavorite;

});

```

  

#### 2. **Debounce en Búsqueda**

```typescript

const  useDebouncedSearch  = (query:  string, delay:  number) => {

const [debouncedQuery, setDebouncedQuery] =  useState(query);

useEffect(() => {

const timer =  setTimeout(() => {

setDebouncedQuery(query);

}, delay);

return () =>  clearTimeout(timer);

}, [query, delay]);

return debouncedQuery;

};

```

  

#### 3. **Optimización de Imágenes**

```typescript

// Implementar lazy loading de imágenes

import FastImage from  'react-native-fast-image';

  

<FastImage

source={{ uri: hero.images.md }}

style={styles.image}

resizeMode={FastImage.resizeMode.cover}

priority={FastImage.priority.normal}

/>

```

  

### Aspectos Pendientes y Mejoras Futuras

  

#### 1. **Testing**

-  **Unit Tests**: Implementar tests para utils y hooks

-  **Integration Tests**: Tests para flujos completos



  

#### 2. **Internacionalización**

```typescript

// Implementar i18n

import i18n from  'i18next';

  

const translations = {

en: {

heroes:  'Superheroes',

favorites:  'Favorites',

teams:  'Teams',

},

es: {

heroes:  'Superhéroes',

favorites:  'Favoritos',

teams:  'Equipos',

},

};

```
  

##  Tecnologías Utilizadas

  

### Frontend

-  **React Native 0.81.1** - Framework principal

-  **TypeScript** - Tipado estático

-  **React Navigation 6** - Navegación

-  **React Native SVG** - Iconos vectoriales

-  **React Native Linear Gradient** - Gradientes

-  **React Native Fast Image** - Optimización de imágenes

  

### Backend & Storage

-  **SQLite** - Base de datos local

-  **React Native SQLite Storage** - Integración SQLite

-  **NetInfo** - Detección de conectividad

  

### Autenticación

-  **Turbo Modules** - Módulos nativos personalizados

-  **Android BiometricPrompt** - Autenticación biométrica Android

  

### Desarrollo

-  **ESLint** - Linting

-  **Prettier** - Formateo de código

-  **Babel** - Transpilación

-  **Metro** - Bundler

  

##  Estructura del Proyecto

  

```

src/

├── app/ # Configuración de la app

├── assets/ # Recursos estáticos

│ ├── fonts/ # Fuentes personalizadas

│ ├── icons/ # Iconos SVG

│ ├── images/ # Imágenes PNG/JPG

│ └── lottie/ # Animaciones Lottie

├── features/ # Módulos por funcionalidad

│ ├── heroes/ # Módulo de superhéroes

│ ├── favorites/ # Módulo de favoritos

│ ├── teams/ # Módulo de equipos

│ └── splash/ # Pantalla de inicio

├── navigation/ # Configuración de navegación

├── native-modules/ # Módulos nativos personalizados

├── services/ # Servicios y APIs

│ ├── auth/ # Autenticación

│ └── storage/ # Persistencia de datos

├── shared/ # Componentes y utilidades compartidas

│ ├── components/ # Componentes reutilizables

│ ├── hooks/ # Hooks personalizados

│ ├── types/ # Definiciones de tipos

│ └── utils/ # Utilidades

├── state/ # Gestión de estado global

└── theme/ # Sistema de diseño

├── colors.ts # Paleta de colores

├── typography.ts # Tipografías

├── spacing.ts # Espaciado

├── radius.ts # Border radius

└── shadows.ts # Sombras

```

  

## 📄 Licencia

  

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

  

## 👨‍💻 Autor

  
Brandon Sicay. 
Desarrollado como parte de una prueba técnica para demostrar habilidades en React Native, TypeScript y desarrollo móvil.

  

---

  
