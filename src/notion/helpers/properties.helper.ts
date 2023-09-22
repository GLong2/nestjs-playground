export function richTextProperty(key: string, text: string) {
  return {
    [key]: {
      rich_text: [
        {
          text: {
            content: text,
          },
        },
      ],
    },
  };
}

export function titleProperty(key: string, text: string) {
  return {
    [key]: {
      title: [
        {
          text: {
            content: text,
          },
        },
      ],
    },
  };
}

export function numberProperty(key: string, number: number) {
  return {
    [key]: {
      number: number,
    },
  };
}
