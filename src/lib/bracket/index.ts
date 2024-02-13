import { BracketService } from './bracket';
import { FirestoreBracketDataProvider } from './providers/firestore';

export const bracket = new BracketService(new FirestoreBracketDataProvider());