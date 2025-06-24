import React from 'react'
import { Button, Stack } from 'react-bootstrap';
import { HomeNavabr } from '../../components/HomeNavbar/HomeNavabr';
import HomeBanner from '../../components/HomeBanner/HomeBanner';
import { HomePopularTutors } from '../../components/HomePopularTutors/HomePopularTutors';
import HomeReviews from '../../components/HomeReviews/HomeReviews';
import HomeFooter from '../../components/HomeFooter/HomeFooter';

export const Home = () => {
  return (
    <>
    <HomeNavabr/>
    <HomeBanner/>
    <HomePopularTutors/>
    <HomeReviews/>
    <HomeFooter/>
    </>
  )
}
