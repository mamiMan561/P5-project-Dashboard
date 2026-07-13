# Web Development Project 6 - *Data Dashboard Part 2*

Submitted by: **Mohammed Esmael**

This web app: **A live flight-tracking dashboard built with React and the Aviationstack API. The dashboard view shows summary statistics, two data visualizations, and a searchable/filterable list of flights. Clicking any flight opens a dedicated detail page with its full itinerary — terminals, gates, delays, estimated times, aircraft, and codeshare info — each reachable at its own unique URL.**

Time spent: *4** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **Clicking on an item in the list view displays more details about it**
  - Clicking on an item in the dashboard list navigates to a detail view for that item
  - Detail view includes extra information about the item not included in the dashboard view
  - The same sidebar is displayed in detail view as in dashboard view
  - *To ensure an accurate grade, your sidebar **must** be viewable when showing the details view in your recording.*
- [x] **Each detail view of an item has a direct, unique URL link to that item’s detail view page**
  -  *To ensure an accurate grade, the URL/address bar of your web browser **must** be viewable in your recording.*
- [x] **The app includes at least two unique charts developed using the fetched data that tell an interesting story**
  - At least two charts should be incorporated into the dashboard view of the site
  - Each chart should describe a different aspect of the dataset


The following **optional** features are implemented:

- [ ] The site’s customized dashboard contains more content that explains what is interesting about the data 
  - e.g., an additional description, graph annotation, suggestion for which filters to use, or an additional page that explains more about the data
- [ ] The site allows users to toggle between different data visualizations
  - User should be able to use some mechanism to toggle between displaying and hiding visualizations 

  
The following **additional** features are implemented:

* [x] Persistent sidebar with a live count of tracked flights, shown on every route
* [x] Two summary charts describing different aspects of the data: a **flight status breakdown** (operational state) and a **busiest departure airports** ranking (geography)
* [x] Search by departure or arrival airport, combined with a status category filter
* [x] Null-safe rendering throughout — the Aviationstack response contains many `null` fields (airline names, IATA codes, terminals), all handled with optional chaining and `—` fallbacks
* [x] Fully responsive layout (sidebar collapses to a top bar on narrow screens) with keyboard focus states and reduced-motion support
* [x] Local mock-data fallback for developing against the free-tier API quota

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<div>
    <a href="https://www.loom.com/share/20a29bf0a4fb4cf1ae7616ab89623158">
      <p>data_dash - 13 July 2026 - Watch Video</p>
    </a>
    <a href="https://www.loom.com/share/20a29bf0a4fb4cf1ae7616ab89623158">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/20a29bf0a4fb4cf1ae7616ab89623158-db66daa6f2c68c19-full-play.gif#t=0.1">
    </a>
  </div>

## Notes

The main challenge was that the Aviationstack `/flights` endpoint has no "get a single flight by ID" route, so the detail view can't fetch its own data. I solved this by lifting the fetch up to the top-level `App` component and sharing the flight array with both views through props. Each flight is assigned a stable `id` equal to its index in the array as the data loads, which becomes the value in its `/flights/:id` URL — necessary because the API's own fields (`flight.iata`) are frequently `null` and routes repeat, so no field was reliably unique on its own.

The other recurring challenge was the inconsistency of the data: airline names, IATA codes, terminals, gates, and delays are `null` far more often than not. Every display value is guarded with optional chaining and a fallback so the UI never crashes on missing fields, and the free-tier monthly quota is easy to exhaust while testing, which is why a local mock-data fallback is wired into the fetch.

### Built with

- React + Vite
- React Router (`BrowserRouter`, `Routes`, `Link`, `useParams`)
- Recharts (pie and bar charts)
- Aviationstack API

## License

    Copyright 2026 Mohammed Esmael
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.