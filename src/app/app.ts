import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Web3Service } from '@shared/services/web3.service';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Background } from '@shared/ui/background/background';

interface UserStats {
  wins: number;
  losses: number;
  draws: number;
  profit: number;
  streak: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputNumberModule,
    ToastModule,
    Background,
  ],
  providers: [MessageService],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit, OnDestroy {
  account: string | null = null;
  ethBalance = '0';

  selectedChoice: number | null = null;
  betAmount = 0.01;
  quickBets = [0.01, 0.05, 0.1];

  isPlaying = false;
  gameResult: any = null;

  globalStats = { games: 0, wagered: '0' };
  userStats: UserStats = { wins: 0, losses: 0, draws: 0, profit: 0, streak: 0 };
  activityFeed: any[] = [];

  private pollInterval: any;

  public web3Service = inject(Web3Service);
  private messageService = inject(MessageService);

  async ngOnInit() {
    this.web3Service.account$.subscribe((acc) => (this.account = acc));
    this.web3Service.balance$.subscribe((bal) => (this.ethBalance = bal));

    this.pollInterval = setInterval(async () => {
      if (this.account) {
        await this.loadGlobalData();
        await this.loadActivityFeed();
      }
    }, 15000);
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  async connect() {
    const success = await this.web3Service.connectWallet();
    if (success && this.account) {
      this.loadUserStats();
      await this.loadGlobalData();
      await this.loadActivityFeed();
      this.messageService.add({
        severity: 'success',
        summary: 'Успех',
        detail: 'Кошелек подключен!',
      });
    }
  }

  selectChoice(choice: number) {
    this.selectedChoice = choice;
  }

  setQuickBet(amount: number) {
    this.betAmount = amount;
  }

  async play() {
    if (!this.account) return this.showError('Подключите кошелек!');
    if (this.selectedChoice === null) return this.showError('Выберите жест!');
    if (this.betAmount <= 0)
      return this.showError('Введите корректную ставку!');

    this.isPlaying = true;
    this.gameResult = null;

    try {
      const receipt = await this.web3Service.playGame(
        this.account,
        this.selectedChoice,
        this.betAmount.toString(),
      );

      const event = receipt.events.GamePlayed.returnValues;
      const payoutEth = this.web3Service.web3!.utils.fromWei(
        event.payoutAmount,
        'ether',
      );

      this.gameResult = {
        playerMove: this.getMoveName(Number(event.playerChoice)),
        computerMove: this.getMoveName(Number(event.computerChoice)),
        outcome: event.outcomeDescription,
        payout: payoutEth,
      };

      await this.web3Service.updateBalance(this.account);
      this.updateLocalStats(
        event.outcomeDescription,
        Number(event.payoutAmount) / 1e18 - this.betAmount,
      );
      await this.loadGlobalData();
    } catch (error: any) {
      if (error.code === 4001) {
        this.showError('Транзакция отклонена пользователем.');
      } else {
        this.showError(`Ошибка игры: ${error.message}`);
      }
    } finally {
      this.isPlaying = false;
    }
  }

  private async loadGlobalData() {
    const stats = await this.web3Service.getGlobalStats();
    if (stats) this.globalStats = stats;
  }

  private async loadActivityFeed() {
    const events = await this.web3Service.getRecentEvents();
    this.activityFeed = events
      .slice(-5)
      .reverse()
      .map((e: any) => ({
        player: `${e.returnValues.player.slice(0, 6)}...${e.returnValues.player.slice(-4)}`,
        outcome: e.returnValues.outcomeDescription,
        bet: this.web3Service.web3!.utils.fromWei(
          e.returnValues.betAmount,
          'ether',
        ),
      }));
  }

  private loadUserStats() {
    const saved = localStorage.getItem(`stats_${this.account}`);
    if (saved) {
      this.userStats = JSON.parse(saved);
    } else {
      this.userStats = { wins: 0, losses: 0, draws: 0, profit: 0, streak: 0 };
    }
  }

  private updateLocalStats(outcome: string, profitEth: number) {
    if (outcome === 'Player Wins') {
      this.userStats.wins++;
      this.userStats.streak++;
    } else if (outcome === 'Computer Wins') {
      this.userStats.losses++;
      this.userStats.streak = 0;
    } else {
      this.userStats.draws++;
      this.userStats.streak = 0;
    }
    this.userStats.profit += profitEth;

    localStorage.setItem(
      `stats_${this.account}`,
      JSON.stringify(this.userStats),
    );
  }

  getMoveName(choice: number): string {
    return ['✊ Камень', '✋ Бумага', '✌️ Ножницы'][choice];
  }

  private showError(msg: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: msg,
    });
  }
}
