export type NotionInputObject = {
  object: string;
  id: string;
  properties: {
    [key: string]: {
      id: string;
      type: string;
      rich_text?: Array<{
        type: string;
        text: {
          content: string;
          link: null;
        };
      }>;
      number?: number;
      title?: Array<{
        type: string;
        text: {
          content: string;
          link: null;
        };
      }>;
    };
  };
};

export type NotionOutputObject = {
  id: string;
  No: string;
  FirstName: string;
  LastName: string;
  Salary: number;
  Age: number;
};

export function transformData(inputs: NotionInputObject[]): NotionOutputObject[] {
  const result = [];
  for (const input of inputs) {
    const inputObj = {
      id: input.id,
      No: input.properties.No.title[0].text.content,
      FirstName: input.properties.FirstName.rich_text[0].text.content,
      LastName: input.properties.LastName.rich_text[0].text.content,
      Salary: input.properties.Salary.number!,
      Age: input.properties.Age.number!,
    };
    result.push(inputObj);
  }
  return result;
}
