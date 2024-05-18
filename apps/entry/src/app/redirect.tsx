import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

export const Redirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const page = searchParams.get('page');
    if (page) {
    navigate(page)
    }
  }, [navigate, searchParams])

  return null;
}
