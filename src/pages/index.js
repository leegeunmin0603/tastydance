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
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호

  // 검색 결과를 설정하는 콜백 함수
  const handleSearchResults = (results) => {
    setSearchResults(results);
    setCurrentPage(1); // 검색 결과가 변경될 때 페이지를 1로 초기화
  };

  // 현재 페이지에 해당하는 검색 결과 추출
  const itemsPerPage = 3; // 페이지당 보여줄 아이템 개수
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = searchResults.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
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
                <Typography variant="h4">안심맛춤</Typography>
              </Stack>
            </Stack>
            {/* 콜백 함수 전달 */}
            <CompaniesSearch setSearchResult={handleSearchResults} />
            {searchResults.length > 0 && (
              <Grid container spacing={3}>
                {currentResults.map((company) => (
                  <Grid xs={12} md={6} lg={4} key={company.id}>
                    <CompanyCard company={company} />
                  </Grid>
                ))}
              </Grid>
            )}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 2,
              }}
            >
              <Pagination
                count={Math.ceil(searchResults.length / itemsPerPage)} // 전체 페이지 수 계산
                page={currentPage}
                size="small"
                onChange={handlePageChange}
              />
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
