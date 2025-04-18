import FullScreenLoader from "@/components/FullScreenLoader";
import { isUserAuthenticated } from "@/lib/utils";
import { getCurrentUser } from "@/store/user/actions";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router";

const ProtectedLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((root) => root.user);
  const isAuthenticated = isUserAuthenticated();
  const navigate = useNavigate();
  const [isLoadingGetMyProfile, setIsLoadingGetMyProfile] = useState(false);

  const fetchProfile = useCallback(async () => {
    setIsLoadingGetMyProfile(true);
    if (isAuthenticated) {
      try {
        await dispatch(getCurrentUser());
      } catch (error) {
        console.log(error);
        navigate("/login");
      }
    }
    setIsLoadingGetMyProfile(false);
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [fetchProfile, user]);

  if (isAuthenticated) {
    if (isLoadingGetMyProfile) {
      return <FullScreenLoader />;
    }
    return <Outlet />;
  }

  return <Navigate to="/login" />;
};

export default ProtectedLayout;
