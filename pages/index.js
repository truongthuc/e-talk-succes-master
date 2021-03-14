import React, { useState, useEffect } from 'react';
import Signin from '~/pages/login/signin';
import { getLayout } from '~/components/Layout';
import Router, { useRouter } from 'next/router';

const Index = () => <Signin />;

export default Index;
