export default {
  "id": 17,
  "title": "Pickup Order",
  "framework": "Fastify",
  "transport": "api",
  "details": [],
  "projects": [],
  "actions": [
    [
      "ready",
      "Mark ready"
    ]
  ],
  "capacity": 0,
  "adminOnly": false,
  "hideForm": false,
  "publicList": false,
  "formNote": "Your details are used only to handle this request.",
  "kind": "order",
  "eyebrow": "THE CORNER KITCHEN",
  "headline": "Good food. Ready when you are.",
  "description": "Choose a lunch for collection. We will email you when it is ready. Pay at the counter.",
  "button": "Place pickup order",
  "fields": [
    {
      "name": "name",
      "label": "Your name",
      "type": "text"
    },
    {
      "name": "email",
      "label": "Email address",
      "type": "email"
    },
    {
      "name": "item",
      "label": "Choose your lunch",
      "type": "select",
      "options": [
        {
          "value": "soup",
          "label": "Seasonal soup \u00b7 $8"
        },
        {
          "value": "sandwich",
          "label": "Garden sandwich \u00b7 $10"
        },
        {
          "value": "salad",
          "label": "Grain salad \u00b7 $11"
        }
      ]
    },
    {
      "name": "quantity",
      "label": "Quantity",
      "type": "select",
      "options": [
        {
          "value": "1",
          "label": "1"
        },
        {
          "value": "2",
          "label": "2"
        },
        {
          "value": "3",
          "label": "3"
        }
      ]
    }
  ],
  "success": "Your order is saved. We will email you when it is ready.",
  "accent": "#6654a1",
  "batch": false
};
