import ReactHtmlParser from 'react-html-parser';

export const textFormater = rawData => {
  const data = rawData.data;
  let result;
  switch (rawData.type) {
    case 'projects':
      result = {};
      for (let key in data) {
        if ( typeof data[key] !== 'string' ) continue;
        result[key] = data[key].replace( /\\n/g, '\n');
      };
      return result;

    case 'shortString':
      result = (typeof data === 'string' && data.length > rawData.maxLength) //добавить выбор длины из вне
        ? data.slice(0, rawData.maxLength) + '...'
        : data;
      return result;

    case 'blog':
      
      result = [];
      const rawText = !!data.match(/\*\*([\s\S]+?)\*\*/g)
        ? data.match(/\*\*([\s\S]+?)\*\*/g)
        : result.push({type: document.createElement('p'), data});

      if ( !Array.isArray( rawText ) ) return result;

      rawText.forEach( item => {
        
        if ( !!item.match(/^\*\*Image\d+/g) ) {
          const imageName = item
            .slice(2, -2)
            .match(/^(I|i)mage\d+/g) || "";  // Звёздочки остаются, их сослайсить и всетаки подумать про разделение по тегам 
          return result.push( {type: document.createElement('img'), data: imageName[0].toLowerCase()} );
        };
        if ( item.startsWith('**p') ){
          const data = extraMarkup( item.slice(3, -3) );
          return result.push( {type: document.createElement('p'), data: ReactHtmlParser( data ) } );
        }
        
      });
      return result
    default:
      break;
  }
}

function extraMarkup( str ) {
  const result = str
    .replace(/=\*b/g, '<b>') 
    .replace(/b\*=/g, '</b>')
    .replace(/=\*i/g, '<i>')
    .replace(/i\*=/g, '</i>')
    .replace(/=\*ins/g, '<ins>')
    .replace(/ins\*=/g, '</ins>');
  return result;
}

// **p ЛЮБОЙ_ТЕКСТ p**
// **img  img** \*\*img([\s\S]+?)img\*\*
// **b жирный
// **i курсив
// **ins подчерк 