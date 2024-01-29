import { Client } from '@elastic/elasticsearch';

// Elasticsearch 클라이언트 생성
const clientES = new Client({
  node: 'http://59.11.252.124:9200',
});

const datas = [
    {
        
        title: '진주햄',
        description: '진주햄 맛있다.',
        logo: '/assets/logos/진주햄.png',
        link: 'blog.naver.com/tastydance/223333867255',
    },
    {
        title: '한입쏙쏙비엔나',
        description: '한입쏙쏙비엔나 맛있다.',
        logo: '/assets/logos/한입쏙쏙비엔나.png',
        link: 'blog.naver.com/tastydance/223329259664',
    },
    {
        title: '들기름을넣어고소한비엔나',
        description: '들기름을넣어고소한비엔나 맛있다.',
        logo: '/assets/logos/들기름을넣어고소한비엔나.png',
        link: 'blog.naver.com/tastydance/223323237171',
    },
    {
        title: '두툼한그릴비엔나',
        description: '두툼한그릴비엔나 맛있다.',
        logo: '/assets/logos/두툼한그릴비엔나.png',
        link: 'blog.naver.com/tastydance/223318558816',
    },
    {
        title: '동원비엔나소시지',
        description: '동원비엔나소시지 맛있다.',
        logo: '/assets/logos/동원비엔나소시지.jpg',
        link: 'blog.naver.com/tastydance/223314518895',
    },
    {
        title: '스모크비엔나',
        description: '스모크비엔나 맛있다.',
        logo: '/assets/logos/스모크비엔나.png',
        link: 'blog.naver.com/tastydance/223303614291',
    },
    {
        title: '칼집비엔나',
        description: '칼집비엔나 맛있다.',
        logo: '/assets/logos/칼집비엔나.png',
        link: 'blog.naver.com/tastydance/223300322349',
    },
    {
        title: '칼집낸요리비엔나',
        description: '칼집낸요리비엔나 맛있다.',
        logo: '/assets/logos/칼집낸요리비엔나.jpg',
        link: 'blog.naver.com/tastydance/223291944103',
    },
    {
        title: '의성마늘프랑크',
        description: '의성마늘프랑크 맛있다.',
        logo: '/assets/logos/의성마늘프랑크.jpg',
        link: 'blog.naver.com/tastydance/223283898916',
    },
    {
        title: '주부9단비엔나소시지',
        description: '주부9단비엔나소시지 맛있다.',
        logo: '/assets/logos/주부9단비엔나소시지.jpg',
        link: 'blog.naver.com/tastydance/223269051065',
    },
    {
        title: '한입쏙칼집비엔나',
        description: '한입쏙칼집비엔나 맛있다.',
        logo: '/assets/logos/한입쏙칼집비엔나.jpg',
        link: 'blog.naver.com/tastydance/223266894608',
    },
    {
        title: '통그릴비엔나',
        description: '통그릴비엔나 맛있다.',
        logo: '/assets/logos/통그릴비엔나.jpg',
        link: 'blog.naver.com/tastydance/223259525066',
    },
    {
        title: '더건강한그릴비엔나',
        description: '더건강한그릴비엔나 맛있다.',
        logo: '/assets/logos/더건강한그릴비엔나.jpg',
        link: 'blog.naver.com/tastydance/223253106527',
    },
    {
        title: '더건강한미니비엔나',
        description: '더건강한미니비엔나 맛있다.',
        logo: '/assets/logos/더건강한미니비엔나.jpg',
        link: 'blog.naver.com/tastydance/223225192406',
    },
    {
        title: '롯데비엔나',
        description: '롯데비엔나 맛있다.',
        logo: '/assets/logos/롯데비엔나.jpg',
        link: 'blog.naver.com/tastydance/223201473251',
    }
]


async function createIndex(indexName, mappingproperties) {
    try {
      
      const response = await clientES.indices.create({
        index: indexName,
        body: {
            mappings: {
              properties: mappingproperties
            }
          }
      });
      
      console.log(`인덱스 ${indexName} 생성 완료`);
      return response;
    } catch (error) {
      console.error(`인덱스 ${indexName} 생성 중 에러 발생:`, error);
      return error;
    }
}
  
async function insertData(indexName, document) {
try {
    const response = await clientES.index({
    index: indexName, // 생성한 인덱스 이름
    body: document,   // 입력할 문서 데이터
    });

    console.log('데이터 입력 결과:', response);
    return response;
} catch (error) {
    console.error('데이터 입력 중 에러 발생:', error);
}
}

// 인덱스 삭제 함수
async function deleteIndex(indexName) {
    try {
      const response = await clientES.indices.delete({
        index: indexName,
      });
  
      console.log(`인덱스 ${indexName} 삭제 완료`);
    } catch (error) {
      console.error(`인덱스 ${indexName} 삭제 중 에러 발생:`, error);
    }
  }

async function Search_All_Indexvalue(indexName) {
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


(async () => {
    
    // 사용자로부터 입력 받은 인덱스 이름
    const userIndexName = 'tastydance_sausage';

    // const delete_index = await deleteIndex(userIndexName);
    // const results = await createIndex(userIndexName);
    
    // const insertPromises = datas.map(async (data) => {
    //     const insert_response = await insertData(userIndexName, data);
    //     console.log('데이터 입력 결과:', insert_response);
    // });

    // 모든 데이터 입력을 기다리기 위해 Promise.all 사용
    // await Promise.all(insertPromises);

    const result = await Search_All_Indexvalue(userIndexName);
    console.log('test');
  
    // console.log(result.hits.hits);
})();


// 사용자로부터 입력 받은 mapping properties
// const userProperties = {
//     title: { type: 'text' },
//     description: { type: 'text' },
//     logo: { type: 'text' },
//     link: { type: 'text' },
//     };

