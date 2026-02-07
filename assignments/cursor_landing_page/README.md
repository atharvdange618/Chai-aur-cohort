# Cursor Landing Page Assignment

**Hosted Link:** [https://cursor.atharvdangedev.in](https://cursor.atharvdangedev.in)

This project is a recreation of the Cursor landing page, focusing on replicating the structure, styling, and responsiveness of the original.

## Sections Recreated

The following major sections of the landing page have been recreated:

- **Header:** Navigation bar with the Cursor logo, main navigation links (Features, Enterprise, Pricing, Resources dropdown), and action buttons (Sign in, Download).
- **Hero Section:** The prominent introductory section featuring the main headline, a call-to-action button, and a visual preview of the Cursor editor UI.
- **Logo Garden:** A section showcasing logos of companies that trust Cursor.
- **Agent Feature:** This section is reused for three distinct feature showcases:
  - "Agent turns ideas into code"
  - "Magically accurate autocomplete"
  - "Everywhere software gets built"
- **Testimonials:** Displays testimonials from notable users and industry leaders.
- **Frontier:** Highlights key aspects of Cursor, such as model access, codebase understanding, and enterprise solutions.
- **Changelog:** A brief overview of recent updates and releases.
- **Careers:** Information about career opportunities at Cursor, including a headline and a team image.
- **Highlights:** A section dedicated to recent product and research highlights/blog posts.
- **Final Call to Action (CTA):** A concluding section encouraging users to download Cursor.
- **Footer:** Contains comprehensive links categorized into Product, Resources, Company, and Legal, along with social media links, copyright information, and theme/language selectors.

## Fonts Used

- `CursorGothic-Regular`: The primary custom font used throughout the landing page, loaded from `fonts/CursorGothic_Regular-s.p.a361088d.woff2`.
- `system-ui`, `"Helvetica Neue"`, `Helvetica`, `Arial`, `sans-serif`: Fallback fonts to ensure consistent typography across various systems.

## Colors Used

The color palette is primarily dark-themed, using the following key colors (defined as CSS variables where applicable):

- `--bg-dark`: `#14120b` (Main dark background color)
- `--bg-muted`: `#1b1913` (Slightly lighter dark background for cards and sections)
- `--text-main`: `#edecec` (Primary light text color)
- `--text-muted`: `#8e8e8e` (Muted grey text color for secondary information)
- `--text-dark`: `#14120b` (Used for text on light backgrounds, e.g., primary button)
- `--text-red`: `#f54e00` (Accent red color for call-to-action links and highlights)

Additional colors used:

- `#f7f7f4`: Light theme color for media queries.
- `#1a1a1a`: Background for button hover states.
- `#000000`: Black, used for download button text and specific background elements.
- `#1a1a16`: Background for sub-navigation cards, some section backgrounds, theme switcher, and language selector.
- `#262620`: Border color for various UI elements like cards and navigation.
- `#a1a1a1`: Default link color within sub-navigation grids.
- `#ffffff`: White, used for hover states on sub-navigation links and primary buttons.
- `#333`: Dark grey, used for some borders (e.g., agent preview, changelog tags).
- `#201e18`: Background color for highlight cards.
- `#ff4d4d`: Specific link color for "View more posts".
- `#151512`: Used in a linear gradient for the model picker background.
