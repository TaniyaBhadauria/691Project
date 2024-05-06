import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, TextareaAutosize, Grid, Tabs, Tab, Avatar, Divider, TextField, } from '@mui/material';
import TweetList from './TweetList';
import { Breadcrumb, Menu, Layout, theme } from 'antd';
import { Table } from 'antd';

const { Header, Content, Footer } = Layout;

const TweetForm: React.FC = () => {
  const [tweetText, setTweetText] = useState('');
  const [tweetPosted, setTweetPosted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('1');
  const [userProfileData, setUserProfileData] = useState<any>({});
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const tweets = [
    { id: 1, text: 'This is the first tweet' },
    { id: 2, text: 'Another tweet here' },
    // Add more tweets as needed
  ];
  const recommendedHashtags = ['#programming', '#technology', '#design'];
  const recommendedUsers = ['@user1', '@user2', '@user3'];

  const [tabIndex, setTabIndex] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  const handleMenuClick = (e: any) => {
    setActiveTab(e.key);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tweet Posted',
      dataIndex: 'text',
      key: 'text',
    },
  ];


  const handleTweetChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweetText(event.target.value);
  };

  const handleTweetSubmit = async () => {
    try {
      // Get user details from the session object
      const userDetails = JSON.parse(sessionStorage.getItem('userDetails') || '{}');

      
      // Call the API to insert the tweet
      const response = await fetch(`http://localhost:8000/insert-tweet?email=${userDetails.emailId}&password=${userDetails.password}&userName=${userDetails.userName}&tweetText=${encodeURIComponent(tweetText)}`);
        setTweetText('');
        const data = await response.json();
        sessionStorage.setItem('tweets', JSON.stringify(data));
        setTweetPosted(true)
        const tweetdetails = JSON.parse(sessionStorage.getItem('tweets') || '{}');
        setUserProfileData(tweetdetails)
        console.log('Tweet submitted successfully:', tweetText);
        console.log(sessionStorage.getItem('tweets'))
    } catch (error) {
      console.error('Failed to submit tweet', error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
        <Grid container spacing={3} >
        <Grid item xs={12} sm={4} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* Set xs={12} for full width on small screens and sm={6} for half width on larger screens */}
          <Typography variant="h6" gutterBottom>Post a Tweet</Typography>
        </Grid>
      <Grid item xs={12} sm={6}>
      <TextareaAutosize
        value={tweetText}
        onChange={handleTweetChange}
        minRows={8}
        minLength={12}
        placeholder="Enter your tweet"
        style={{ width: '100%', resize: 'none' }}
      />
      <Button variant="contained" color="primary" onClick={handleTweetSubmit}>Submit</Button>
      </Grid>
      </Grid>
      {tweetPosted && 
      <Box sx={{ p: 4 }}>
      <Grid item xs={12} sm={4} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Tabs value={tabIndex} onChange={handleChangeTab} centered>
          <Tab label="Recommendations" />
          <Tab label="Tweet History" />
        </Tabs>
      </Grid>
      <Box sx={{ p: 4 }}>
        {tabIndex === 1 && (
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Tweets</h2>
            <Table dataSource={tweets} columns={columns} />
          </Grid>
        )}
        {tabIndex === 0 && (
          <Grid item xs={12} sm={4} sx={{ textAlign: 'start', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Recommendations</h2>
            <Layout>
              <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu
                  theme="dark"
                  mode="horizontal"
                  defaultSelectedKeys={['1']}
                  onClick={handleMenuClick}
                  items={[
                    { key: '1', label: 'Recommended Hashtags' },
                    { key: '2', label: 'Recommended Users' },
                  ]}
                  style={{ flex: 1, minWidth: 0 }}
                />
              </Header>
              <Content style={{ padding: '0 48px' }}>
                <div
                  style={{
                    background: colorBgContainer,
                    minHeight: 280,
                    padding: 24,
                    borderRadius: borderRadiusLG,
                  }}
                >
                  {activeTab === '1' ? (
                    <ul>
                      {userProfileData.recommended_hashtags.map((hashtag:any) => (
                        <li key={hashtag}>#{hashtag}</li>
                      ))}
                    </ul>
                  ) : (
                    <ul>
                      {userProfileData.recommended_users.map((user:any) => (
                        <li key={user}>@{user}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </Content>
            </Layout>
          </Grid>
        )}
      </Box>
    </Box>
}
    </Box>
  );
}

export default TweetForm;
