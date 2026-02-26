import { Request, Response, NextFunction } from "express";

export const isSeller = (req: Request, res: Response, next: NextFunction) => {
    const role = req.headers["x-user-role"];

    if (role !== "SELLER") {
        return res.status(403).json({
            message: "Access denied. Seller role required.",
        });
    }

    next();
};

export const isUser = (req: Request, res: Response, next: NextFunction) => {
    const role = req.headers["x-user-role"];

    if (role !== "USER" && role !== "SELLER") {
        return res.status(403).json({
            message: "Access denied. User role required.",
        });
    }

    next();
};
