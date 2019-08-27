import { SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver } from "graphql";
export class IsAuthDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function(...args) {
        let source, me;
        [source, {}, { me } ] = args;
        if(!me){
          throw new Error('Login to view the text field');
        }
        const result = await resolve.apply(this, args);
        return result;
      };
    }
  }