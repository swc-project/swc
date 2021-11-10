import { NextFunction, Request, Response } from "express";
import express from "express";

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
});
app.use(
  express.static()
);