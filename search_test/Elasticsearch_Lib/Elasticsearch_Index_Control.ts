
import { Client } from '@elastic/elasticsearch';
// Elasticsearch 클라이언트 생성
const clientES = new Client({
  node: 'http://59.11.252.124:9200',
});

// Index 생성 함수
// indexName : Table Name
// mappingProperties : Field 
export async function Create_Index(indexName: string, mappingProperties: any) 
{
  try {
    const response = await clientES.indices.create({
      index: indexName,
      body: {
        mappings: {
          properties: mappingProperties
        }
      }
    });
    console.log('Index created:', response);
  } catch (error) {
    console.error('Error creating index:', error);
  }
}

// Index 생성 함수
// indexName : Table Name
// data : any
// any(dict mapping) = field : value 
export async function Index_Put_Data(indexName : string, data: any) 
{
    try 
    {
        const response = await clientES.index
        ({
            index: indexName,
            body: data
        });
        console.log('Document indexed:', response);
    } 
    catch (error) 
    {
        console.error('Error indexing data:', error);
    }
  
}


// Index 제거 함수
// indexName : Table Name
export async function Delete_Index(indexName : string) 
{
  try 
  {
        const response = await clientES.indices.delete({
        index: indexName
        });
        console.log('Index deleted:', response);
  } 
  catch (error) 
  {
        console.error('Error deleting index:', error);
  }
}

export async function Clear_Index(indexName: string) {
  try {
    const response = await clientES.deleteByQuery({
      index: indexName,
      body: {
        query: {
          match_all: {}, // 모든 문서를 삭제하기 위한 쿼리
        },
      },
    });
    console.log('Cleared index:', response);
  } catch (error) {
    console.error('Error clearing index:', error);
  }
}





