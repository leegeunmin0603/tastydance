import React, { useState } from 'react';
import { Card, InputAdornment, OutlinedInput, SvgIcon, Button } from '@mui/material';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import axios from 'axios'; // axios를 import

export const CompaniesSearch = ({setSearchResult}) => {
  const [searchKeyword, setSearchKeyword] = useState(''); // 검색어 상태 추가
  
  
  const handleSearch = async () => {
    try {
      // 검색 버튼 클릭 시 처리 로직을 여기에 추가
      const indexName = 'tastydance_sausage';

      let response = [];
      if(searchKeyword == '')
      {
        // Axios를 사용하여 서버의 get_all_data 엔드포인트에 GET 요청.
        response = await axios.get(`http://59.11.252.124:8070/essearch/get_all_data?indexName=${indexName}`);

        // 요청이 성공하면 응답 데이터는 response.data
        
      }
      else
      {
        console.log('검색어:', searchKeyword);
        const fieldValue = 'title';        
        response = await axios.get(`http://59.11.252.124:8070/essearch/get_keyword?indexName=${indexName}&field=${fieldValue}&keyword=${searchKeyword}`);
        
      }
      
      const search_research = response.data.map((Data, index) => {
        const id = index;
        const description = Data._source.description;
        const logo = Data._source.logo;
        const title = Data._source.title;
        const link = Data._source.link;      
        return { id, description,logo,title,link, key: index };
      });

      
      setSearchResult(search_research);
      // console.log('검색 결과:', searchData);
    } catch (error) {
      console.error('검색 중 에러 발생:', error);
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        fullWidth
        placeholder="소시지 이름을 검색하세요."
        startAdornment={(
          <InputAdornment position="start">
            <SvgIcon
              color="action"
              fontSize="small"
            >
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        )}
        sx={{ maxWidth: 800 }}
        value={searchKeyword} // 입력 필드의 값은 searchKeyword 상태와 연동됩니다.
        onChange={(e) => setSearchKeyword(e.target.value)} // 입력 값이 변경될 때 상태 업데이트
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch(); // 엔터 키를 눌렀을 때 검색 수행
          }
        }}
      />
      <Button onClick={handleSearch} variant="contained" color="primary">
        검색
      </Button>
    </Card>
  );
};
