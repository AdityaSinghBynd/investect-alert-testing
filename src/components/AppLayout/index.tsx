'use client';

import React, { useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useQueries } from '@tanstack/react-query';

import { RootState } from '@/redux/store';
import { SessionUser } from '@/types/sessionUser';
import { ApiService } from '@/services/service';

import NavigationWrapper from '../NavigationWrapper';
import AppLoadingSkeleton from '../Skeleton/AppLoading';
import { ToastContainer } from 'react-toastify';

import {
  setNewsletterList,
  setNewsletterData,
  setNewsletterHistoryData
} from '@/redux/Newsletter/newsletterSlice';
import { setAppLoading } from '@/redux/App/AppSlice';

import { useFetchAllNewsletters } from '@/hooks/Newsletter/useNewsletter';

const HISTORY_DAYS = 10;
const TOAST_AUTO_CLOSE = 2000;

interface AppLayoutProps {
  children: React.ReactNode;
}

const getDateRange = (days: number) => {
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  };
};

export default function AppLayout({ children }: AppLayoutProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAppLoading = useSelector((state: RootState) => state.app.isAppLoading);

  const user = session?.user as SessionUser | undefined;
  const userId = user?.id ?? '';

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const isUnauthenticated = status === 'unauthenticated';

  // Redirect unauthenticated users
  useEffect(() => {
    if (isLoading) {
      dispatch(setAppLoading(true));
    } else if (isUnauthenticated) {
      dispatch(setAppLoading(false));
      router.push('/auth/login');
    }
  }, [isLoading, isUnauthenticated, dispatch, router]);

  // Fetch newsletters
  const {
    data: newsletters,
    isLoading: isNewslettersLoading
  } = useFetchAllNewsletters(userId, {
    enabled: isAuthenticated && !!userId,
  });

  const alertIds = newsletters?.alerts?.map(alert => alert.alert_id) ?? [];
  const dateRange = useMemo(() => getDateRange(HISTORY_DAYS), []);

  // Newsletter Details & Alerts Queries
  const detailsQueries = useQueries({
    queries: alertIds.map(alertId => ({
      queryKey: ['newsletterDetails', alertId],
      queryFn: () => ApiService.apiCall('GET', `/fetchAlertDetails/${alertId}`).then(r => r.data),
      enabled: isAuthenticated,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }))
  });

  const alertsQueries = useQueries({
    queries: alertIds.map(alertId => ({
      queryKey: ['alerts', alertId, dateRange.startDate, dateRange.endDate],
      queryFn: () =>
        ApiService.apiCall(
          'POST',
          '/companySpecificAlerts/fetchDeliveryData',
          {
            user_id: userId,
            alert_id: alertId,
            start_date: dateRange.startDate,
            end_date: dateRange.endDate
          }
        ).then(r => r.data),
      enabled: isAuthenticated,
      staleTime: 2 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
    }))
  });

  const isDetailsLoading = detailsQueries.some(q => q.isLoading);
  const isAlertsLoading = alertsQueries.some(q => q.isLoading);
  const isDataLoading = isNewslettersLoading || isDetailsLoading || isAlertsLoading;

  const newsletterDetails = detailsQueries.map(q => q.data).filter(Boolean);
  const alertsData = alertsQueries.map(q => q.data).filter(Boolean);

  // Handle store updates
  useEffect(() => {
    if (!isAuthenticated || isDataLoading) return;

    dispatch(setNewsletterList(newsletters?.alerts || []));
    dispatch(setNewsletterData(newsletterDetails));
    dispatch(setNewsletterHistoryData(alertsData));
    dispatch(setAppLoading(false));
  }, [isAuthenticated, isDataLoading, newsletters, newsletterDetails, alertsData, dispatch]);

  // Error handling
  useEffect(() => {
    const hasError = [...detailsQueries, ...alertsQueries].some(q => q.isError);

    if (hasError && !isDataLoading) {
      dispatch(setAppLoading(false));
      console.error('Some queries failed.');
    }
  }, [detailsQueries, alertsQueries, isDataLoading, dispatch]);

  return (
    <>
      {isAppLoading ? (
        <AppLoadingSkeleton />
      ) : (
        <NavigationWrapper>{children}</NavigationWrapper>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={TOAST_AUTO_CLOSE}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
