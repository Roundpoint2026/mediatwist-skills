# Facebook Poster Skill

## Purpose
Post content to Facebook using the Meta Graph API via postToFacebook.js.

## Input
- imageUrl (string)
- caption (string)

## Behavior
- Calls postRunner.js
- Publishes image + caption to Facebook page

## Example
```json
{
  "imageUrl": "https://...",
    "caption": "New post from Mediatwist"
    }
    ```

    ## Notes
    - Requires valid PAGE_ID and ACCESS_TOKEN in .env
    - Uses Graph API v20.0
