import React, { useState } from 'react';
import Head from 'next/head';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CompanyCard } from 'src/sections/companies/company-card';
import { CompaniesSearch } from 'src/sections/companies/companies-search';

const Page = () => {

  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태

  // 검색 결과를 설정하는 콜백 함수
  const handleSearchResults = (results) => {
    
    // console.log(search_research);
    setSearchResults(results);
  };

  return (
    <>
      <Head>
        <title>소시지 정보 검색 | Devias Kit</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Companies</Typography>
                
              </Stack>
              
            </Stack>
            {/* 콜백 함수 전달 */}
            <CompaniesSearch setSearchResult={handleSearchResults} /> 
            {searchResults.length > 0 && ( // 검색 결과가 있을 때만 출력
              <Grid container spacing={3}>
                {searchResults.map((company) => (
                  <Grid xs={12} md={6} lg={4} key={company.id}>
                    <CompanyCard company={company} />
                  </Grid>
                ))}
              </Grid>
            )}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Pagination count={3} size="small" />
            </Box>
           
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
