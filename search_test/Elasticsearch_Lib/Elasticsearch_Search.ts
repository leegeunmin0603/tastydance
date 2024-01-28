import { Client } from '@elastic/elasticsearch';
import { integer } from '@elastic/elasticsearch/lib/api/types';
// Elasticsearch 클라이언트 생성
const clientES = new Client({
  node: process.env.ELASTIC_URL,
});

// Index 내의 모든 데이터 검색
export async function Search_All_Indexvalue(indexName: string) {
  try {
        const response = await clientES.search({
        index: indexName,
        body: {
                query: {
                match_all: {}
                }
            }
        });

        const searchHits = response.hits.hits;
        return searchHits;
    } 
    catch (error) 
    {
        console.error('오류 발생:', error);
        return [];
    }
}

// Index 내의 단일 Field와 단일 keyword가 모두 일치하는 데이터 검색 ( And )
// field1 - keyword1
// const indexName = 'your-index-name';
// const searchTerm = {"field1": "keyword1"}; 
export async function Search_Singlekeyword_Singlefield_Match(indexName:string, searchTerm:any) 
{
  try 
  {
      const response = await clientES.search({
      index: indexName,
      body: {
          query: {
          match : searchTerm,
          },
      },
      });

    const searchHits = response.hits.hits;  
    return searchHits;
  } 
  catch (error) 
  {
      console.error('Error searching data:', error);
      return [];
  }
}


// Index 내의 특정 각 Field에서 하나의 keyword라도 일치하는 데이터 검색 ( Or )
// field1 - keyword1 or field2 - keyword2
// const indexName = 'your-index-name';
// const searchFields = ['field1', 'field2']; // 검색할 필드 목록
// const searchKeywords = ['keyword1', 'keyword2']; // 검색할 키워드 목록
export async function Search_Any_Multikeyword_IN_Multifield(indexName:string, searchField:any, searchKeywords:any)
{
  try {
    const response = await clientES.search({
      index: indexName,
      body: {
        query: {
          multi_match: {
            query: searchKeywords.join(' '), // 검색할 키워드들을 공백으로 구분하여 결합
            fields: searchField,
          },
        },
      },
    });

    const searchHits = response.hits.hits;
    return searchHits;
  } catch (error) {
    console.error('Error searching data:', error);
    return [];
  }

}

// Index 내의 특정 다중 Field에서 하나의 keyword가 일치하는 데이터 검색
// const indexName = 'your-index-name';
// const searchFields = ['field1', 'field2']; // 검색할 필드 목록
// const searchKeywords = ['keyword1']; // 검색할 키워드 목록
export async function Search_Keyword_In_MultiFields(indexName:string, searchFields:any[], keyword:string) {
  try {
    const response = await clientES.search({
      index: indexName,
      body: {
        query: {
          multi_match: {
            query: keyword,
            fields: searchFields
          }
        }
      }
    });

    const searchHits = response.hits.hits;
    return searchHits;
  } catch (error) {
    console.error('Error searching data:', error);
    return [];
  }
}


// Index 내의 특정 다중 Field에서 다중 value가 n개 이상 일치하는 데이터 검색 ( Should n:n)
// const indexName = 'your-index-name';
// const searchFields = ['field1', 'field2']; // 검색할 필드 목록
// const searchKeywords = ['keyword1', 'keyword2']; // 검색할 키워드 목록
export async function Search_OR_Multikeyword_IN_Multifield(indexName:string, searchFields : any , searchKeywords : any ,minimum_match_num : integer) 
{
    try {
      const response = await clientES.search({
        index: indexName,
        body: {
          query: {
            bool: {
              should: searchKeywords.map((term: any) => ({
                multi_match:                 
                {
                  query: term,
                  fields: searchFields,
                },
              })),
              minimum_should_match: minimum_match_num, // 최소한 일치 조건 수
            },
          },
        },
      });
  
      const searchHits = response.hits.hits;
      return searchHits;
    } catch (error) {
      console.error('Error searching data:', error);
      return [];
    }
}

// Index 내의 특정 Field의 다중 value가 일치하는 데이터 검색 ( Should 1:n )
// const indexName = 'your-index-name';
// const searchFields = 'field1' // 검색할 필드 목록
// const searchKeywords = ['keyword1','keyword2'] // 검색할 키워드 목록
export async function Search_OR_Multikeyword_IN_One_Field(indexName:string, searchField:any, searchKeywords:any, minimum_match_num:integer) 
{
    try {
      const response = await clientES.search({
        index: indexName,
        body: {
          query: {
            bool: {
              should: searchKeywords.map((term: any) => ({
                match: {
                  [searchField]: term,
                },
              })),
              minimum_should_match: minimum_match_num, // 최소한 하나의 조건이 일치해야 함
            },
          },
        },
      });
  
      const searchHits = response.hits.hits;
      return searchHits;
    } catch (error) {
      console.error('Error searching data:', error);
      return [];
    }
}
