import type { Schema, Struct } from '@strapi/strapi';

export interface AnswerAnswer extends Struct.ComponentSchema {
  collectionName: 'components_answer_answers';
  info: {
    displayName: 'answer';
  };
  attributes: {
    answer: Schema.Attribute.JSON;
    index: Schema.Attribute.Integer;
    questionType: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'answer.answer': AnswerAnswer;
    }
  }
}
