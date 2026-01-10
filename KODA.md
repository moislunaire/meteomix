# Meteomix — документация проекта

## Обзор проекта

**Meteomix** — это веб-приложение для прогноза погоды, которое агрегирует и сравнивает данные с трёх независимых метеорологических сервисов. Приложение позволяет пользователям искать города, определять местоположение через геолокацию и просматривать прогнозы в удобной сравнительной таблице.

### Основные функции

- **Поиск города** с автодополнением через Yandex Suggest API
- **Геолокация** пользователя для автоматического определения местоположения
- **Прогноз на 7 дней** с трёх источников данных (Open-Meteo, MET Norway, Visual Crossing)
- **Сравнительная таблица** с отображением температуры и погодных условий от каждого сервиса
- **Расчёт средней температуры** (медиана) для каждого дня
- **Избранные города** с сохранением в localStorage
- **Адаптивный интерфейс** для мобильных и десктопных устройств

---

## Технологический стек

### Frontend

| Технология | Назначение |
|------------|------------|
| React 19 | UI-фреймворк |
| TypeScript | Типизация |
| Vite | Сборка и dev-сервер |
| Mantine UI v7 | Компонентная библиотека |
| TanStack Query (RTK Query) | Управление API-запросами |
| Tabler Icons | Иконки |
| Zod | Валидация данных |

### Архитектура

Проект использует методологию **Feature-Sliced Design (FSD)**:

```
src/
├── app/              # Провайдеры, контексты, App.tsx
├── pages/            # Страницы (HomePage)
├── entities/         # Бизнес-сущности (forecast, location)
├── shared/           # Общие компоненты, утилиты, конфиги
└── styles/           # Глобальные стили
```

### API-сервисы

| Сервис | Тип вызова | Назначение |
|--------|------------|------------|
| Open-Meteo | Прямой (CORS) | Прогноз погоды |
| MET Norway | Прямой (CORS) | Прогноз погоды |
| Visual Crossing | Прокси `/api/visualcrossing` | Прогноз погоды |
| Yandex Suggest | Прямой | Автодополнение городов |
| Yandex Geocoder | Прямой | Координаты по городу |

---

## Сборка и запуск

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

### Запуск с Vercel (для полной функциональности)

Для работы API-прокси Visual Crossing требуется локальный сервер Vercel:

```bash
npm run vercel:dev
```

**Требования:**
- Аккаунт Vercel (войти через `npx vercel login`)
- Переменная окружения `VISUALCROSSING_API_KEY` в `.env.local`

После запуска приложение будет доступно по адресу `http://localhost:3000` с работающими эндпоинтами `/api/*`.

### Сборка для production

```bash
npm run build
```

### Предпросмотр production-сборки

```bash
npm run preview
```

### Тестирование

```bash
npm run test          # Запуск тестов
npm run test:watch    # Режим наблюдения
```

### Линтинг

```bash
npm run lint              # Полный линтинг (ESLint + Stylelint + FSD)
npm run lint:fix          # Автоисправление всех линтеров
npm run lint:eslint       # ESLint
npm run lint:eslint:fix   # ESLint с автоисправлением
npm run lint:stylelint    # Stylelint
npm run lint:stylelint:fix # Stylelint с автоисправлением
npm run lint:fsd          # Проверка FSD-архитектуры
npm run lint:fsd:fix      # Автоисправление FSD
```

---

## Конфигурация

### Среда выполнения

| Файл | Описание |
|------|----------|
| `.env.example` | Шаблон переменных окружения |
| `.nvmrc` | Версия Node.js (22.13.1) |
| `vite.config.ts` | Конфигурация Vite |
| `steiger.config.yaml` | Конфигурация Steiger (правила FSD) |

### Переменные окружения

```bash
# Yandex Suggest API (автодополнение городов)
VITE_YANDEX_SUGGEST_KEY_DEV=

# Yandex Geocoder API (координаты по городу)
VITE_YANDEX_GEOCODER_KEY_DEV=

# Visual Crossing API (для работы прокси-сервера)
VISUALCROSSING_API_KEY=
```

**Примечание:** Переменные `VITE_*` используются на клиенте, `VISUALCROSSING_API_KEY` — только на сервере Vercel.

### Статический анализ

| Файл | Назначение |
|------|------------|
| `eslint.config.js` | Конфигурация ESLint |
| `stylelint.config.mjs` | Конфигурация Stylelint |
| `tsconfig.json` | Конфигурация TypeScript |

---

## Структура исходного кода

### `src/app/`

Провайдеры и контексты приложения:

| Файл | Описание |
|------|----------|
| `app.tsx` | Корневой компонент |
| `providers/store/` | Redux Store с RTK Query |
| `providers/location/` | Контекст выбранной локации |

### `src/pages/Home/`

Основная страница приложения:

| Файл/директория | Описание |
|-----------------|----------|
| `ui/HomePage.tsx` | Главная страница |
| `ui/components/` | Компоненты страницы |
| `model/` | Бизнес-логика страницы |

### `src/entities/forecast/`

Модуль прогноза погоды:

| Файл/директория | Описание |
|-----------------|----------|
| `api/forecastApi.ts` | RTK Query endpoints |
| `model/types.*` | TypeScript типы API-ответов |
| `model/normalize/*` | Нормализация данных от источников |

### `src/shared/config/`

Глобальные конфигурации:

| Файл | Описание |
|------|----------|
| `forecast.ts` | Константы прогноза (FORECAST_DAYS = 7) |

### `api/`

Серверные функции Vercel:

| Файл | Описание |
|------|----------|
| `visualcrossing.ts` | Прокси-сервер для API Visual Crossing |

---

## Правила разработки

### Стиль кода

- **TypeScript** со строгой типизацией
- **ESLint** с правилами из `eslint.config.js`
- **Stylelint** для CSS (используется Mantine, CSS Modules)
- **Path aliases** через `@/` (настроено в TypeScript и Vite)

### Паттерны

- **RTK Query** для API-запросов (создание endpoints в `forecastApi.ts`)
- **React Context** для локального состояния (LocationContext)
- **localStorage** для персистентности (избранные города, последняя локация)
- **FSD** — следование методологии Feature-Sliced Design

### Тестирование

Тестовый фреймворк не обнаружен в проекте. TODO: добавить тесты при необходимости.

---

## Ключевые файлы

| Путь | Назначение |
|------|------------|
| `README.md` | Документация проекта |
| `package.json` | Зависимости и npm-скрипты |
| `vite.config.ts` | Конфигурация сборки |
| `steiger.config.yaml` | Правила архитектуры FSD |
| `src/app/app.tsx` | Корневой компонент приложения |
| `src/pages/Home/ui/HomePage.tsx` | Главная страница |
| `src/entities/forecast/api/forecastApi.ts` | API-запросы к погодным сервисам |
| `src/pages/Home/ui/components/ForecastTable.tsx` | Таблица сравнения прогнозов |
| `src/app/providers/location/LocationProvider.tsx` | Управление выбранной локацией |
| `src/pages/Home/model/useAllForecasts.ts` | Хук агрегации данных от всех источников |

---

## API Endpoints

Приложение использует RTK Query для работы с API:

| Endpoint | Источник | Описание |
|----------|----------|----------|
| `getOpenMeteo` | Open-Meteo | Прогноз температуры и кода погоды |
| `getMetNo` | MET Norway | Прогноз в формате compact |
| `getVisualCrossing` | Visual Crossing | Прогноз через прокси-сервер |

Все endpoints возвращают нормализованные данные в едином формате:
- `date`: дата прогноза
- `temp`: температура в °C
- `condition`: описание погоды
- `icon`: иконка погоды

---

## Работа с внешними API

### Yandex API (поиск городов)

Требует API-ключей в переменных окружения:
- `VITE_YANDEX_SUGGEST_KEY_DEV` — для автодополнения
- `VITE_YANDEX_GEOCODER_KEY_DEV` — для геокодирования

### Visual Crossing Proxy

Для Visual Crossing используется прокси-сервер `/api/visualcrossing`, что позволяет избежать проблем с CORS.

---

## Версии

- **Node.js**: 22.13.1 (указана в `.nvmrc`)
- **npm**: для управления зависимостями
- **React**: 19
- **TypeScript**: 5.x
