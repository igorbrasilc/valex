import express, { NextFunction, Request, Response } from 'express';
import "express-async-errors";

export default function errorHandling(error: any, req: Request, res: Response, next: NextFunction) {
    if (error.type === 'notFound') return res.status(404).send(error.message);
    if (error.type === 'unauthorized') return res.status(401).send(error.message);
    if (error.type === 'conflict') return res.status(409).send(error.message);

    console.log(error);
    return res.status(500).send(error);
}