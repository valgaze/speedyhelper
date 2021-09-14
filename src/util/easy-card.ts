export const easyCardBase = (title: string, subtitle: string, text: string) => {
  return {
    type: 'AdaptiveCard',
    body: [
      {
        type: 'ColumnSet',
        columns: [
          {
            type: 'Column',
            items: [
              {
                type: 'TextBlock',
                weight: 'Bolder',
                text: title,
                wrap: true,
                color: 'Light',
                size: 'Large',
                spacing: 'Small',
              },
              {
                type: 'TextBlock',
                text: subtitle,
                weight: 'Lighter',
                color: 'Accent',
              },
            ],
            width: 'stretch',
          },
        ],
      },
      {
        type: 'TextBlock',
        text: text,
        wrap: true,
      },
    ],
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.2',
  }
}
