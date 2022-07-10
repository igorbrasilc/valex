import express, { NextFunction, Request, Response } from 'express';
import "express-async-errors";

export default function errorHandling(error: any, req: Request, res: Response, next: NextFunction) {
    const {type, message} = error;

    if (type === 'notFound') return res.status(404).send(message);
    if (type === 'unauthorized') return res.status(401).send(message);
    if (type === 'conflict') return res.status(409).send(message);
    if (type === 'notAllowed') return res.status(405).send(message);

    console.log(error);
    return res.status(500).send(error);
}