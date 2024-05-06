import React, { useState, useEffect } from 'react';
import { Typography, Box, Avatar, Button, Grid, Divider, TextField, Tabs, Tab } from '@mui/material';
import { Breadcrumb, Menu, Layout, theme } from 'antd';
import { Table } from 'antd';

const { Header, Content, Footer } = Layout;

const TweetList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const [userProfileData, setUserProfileData] = useState<any>({});
  useEffect(() => {
    // Fetch user profile data from session object
    const userDetails = JSON.parse(sessionStorage.getItem('tweets') || '{}');
    setUserProfileData(userDetails)
  }, []);
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

  return (
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
                      {userProfileData.recommended_hashtags.slice(0,20).map((hashtag:any) => (
                        <li key={hashtag}>{hashtag}</li>
                      ))}
                    </ul>
                  ) : (
                    <ul>
                      {recommendedUsers.slice(0,20).map(user => (
                        <li key={user}>{user}</li>
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
  );
}

export default TweetList;
