import { useQuery } from "@tanstack/react-query";
import {authService} from "../services/authServices"


export function useAuth() {
    return useQuery({
        queryKey: ['auth'],
        queryFn: authService.me,
        retry: false,
    })
}