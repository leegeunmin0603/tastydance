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

const companies = [
  {
    id: '1',
    description: 'Dropbox is a file hosting service that offers cloud storage, file synchronization, a personal cloud.',
    logo: 'https://m.pinktree.kr/web/product/big/tf428good500.jpg',    
    link: 'blog.naver.com/tastydance/223329259664',
    title: 'Dropbox'
  },
  {
    id: '2',
    description: 'Medium is an online publishing platform developed by Evan Williams, and launched in August 2012.',
    logo: 'https://postfiles.pstatic.net/MjAyNDAxMTVfMTQ4/MDAxNzA1MzA0MTA5ODc0.Cmq5yw7jbpzeUxUgygDanv55X7LKI7NZckj82rGub_Mg.7SnLJc3I1ZuggVIG9Ij3ygUGWZAtkBsN4PKUoa9XUTwg.PNG.tastydance23/image.png?type=w773',
    link: 'blog.naver.com/tastydance/223333867255',
    title: 'Medium Corporation'
  }
  
];

const Page = () => {
  // const [showCompanies, setShowCompanies] = useState(true);

  return (
    <>
      <Head>
        <title>Companies | Devias Kit</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Companies</Typography>
                
              </Stack>
              
            </Stack>
            <CompaniesSearch />
            {(
              <Grid container spacing={3}>
                {companies.map((company) => (
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
