import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Account } from './Account';
import { OpenAccountDto } from './OpenAccount.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  #accounts: Account[] = [
    {
      id: '1111-2222',
      balance: 235235,
      owner: 'Bob',
      createdAt: new Date(1999, 2, 3)
    },
    {
      id: '2345-4561',
      balance: 7890,
      owner: 'Béla',
      createdAt: new Date(2000, 1, 6)
    },
    {
      id: '6513-8284',
      balance: 1500,
      owner: 'Sanyika',
      createdAt: new Date(2016, 11, 25)
    }
  ]

  @Get('openAccountForm')
  @Render('openAccountForm')
  openAccountForm() {
    return {
      data: {
        id: '',
        balance: 0,
        owner: ''
      },
      errors: []
    }
  }

  @Post('openAccountForm')
  openAccount(@Body() data: OpenAccountDto, @Res() res : Response) {
    let errors = [];
    if (!data.balance || !data.id || !data.owner) {
      errors.push('Minden mezőt meg kell addni');
    }
    if (!/^\d\d\d\d-\d\d\d\d$/.test(data.id)) {
      errors.push('A számlaszám 0000-0000 formátumú legyen');
    } else {
      const acc = this.#accounts.find(e => e.id == data.id);
      errors.push('A számlaszám már létezik')
    }
    const balance: number = parseInt(data.balance);
    if (balance < 0) errors.push('Az egyenleg nem lehet negatív');
    if (errors.length > 0) {
      res.render('openAccountForm', {errors, data});
      return;
    }
    this.#accounts.push({ id: data.id, owner: data.owner, balance: balance, createdAt: new Date() })
    res.redirect('/openAccountForm');
  }
}
