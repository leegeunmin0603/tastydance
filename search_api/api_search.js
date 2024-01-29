
import { Client } from '@elastic/elasticsearch';
import express from 'express';
import cors from 'cors'; // cors 패키지를 직접 import
import bodyParser from 'body-parser';

const app = express();
// CORS 미들웨어 적용
app.use(cors());
app.use(bodyParser.json());


// Elasticsearch 클라이언트 생성
const clientES = new Client({
    node: 'http://59.11.252.124:9200',
  });

// 모든 camera 정보를 읽음.
app.get('/essearch/get_all_data', async (req, res) => {
    
    const query = req.query;
    console.log(query);
    if (query == null || query == undefined ) 
    {
      return res.status(400).json({ error: '쿼리 문자열이 필요합니다.' });
    }

    try {
        const response = await clientES.search({
        index: 'tastydance_sausage',
        body: {
                query: {
                match_all: {}
                }
            }
        });

        const searchHits = response.hits.hits;
        
        res.status(200).json(searchHits);
    } 
    catch (error) 
    {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
  });

app.get('/essearch/get_keyword', async (req, res) => {

const query = req.query;
// const searchTerm = {"field1": "keyword1"}; 
const searchTerm = {[query.field] : query.keyword};
console.log(searchTerm);
if (query == null || query == undefined ) 
{
    return res.status(400).json({ error: '쿼리 문자열이 필요합니다.' });
}

try {
    const response = await clientES.search({
        index: query.indexName,
        body: {
            query: {
            match : searchTerm,
            },
        },
    });

    const searchHits = response.hits.hits;
    // console.log(searchHits);
    res.status(200).json(searchHits);
} 
catch (error) 
{
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred' });
}
});


const port = 8070;
app.listen(port, () => {
console.log(`API 서버가 포트 ${port}에서 실행 중입니다.`);
});