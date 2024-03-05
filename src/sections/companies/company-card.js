import PropTypes from 'prop-types';
// import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
// import ClockIcon from '@heroicons/react/24/solid/ClockIcon';
import { Avatar, Box,Button, Card, CardContent, Divider, Stack, SvgIcon, Typography } from '@mui/material';

export const CompanyCard = (props) => {
  const { company } = props;
  const handleButtonClick = () => {
    window.location.href = `https://${company.link}`;
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 3
          }}
        >
           <img src={company.logo} alt={company.title} style={{ maxWidth: '100%', height: '300px' }} />
        </Box>
        <Typography
          align="center"
          gutterBottom
          variant="h5"
        >
          {company.title}
        </Typography>
        <Typography
          align="center"
          variant="body1"
        >
          {company.description}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Button 
        onClick={handleButtonClick} 
        fullWidth 
        variant="contained" 
        sx={{ mt: 2 }}
      >
        자세히 보기
      </Button>
      <Button 
        onClick={handleButtonClick} 
        fullWidth 
        variant="contained" 
        sx={{ mt: 2 , bgcolor: 'blue'}}
      >
        바로 구매하기
      </Button>
     
    </Card>
  );
};

CompanyCard.propTypes = {
  company: PropTypes.object.isRequired
};
