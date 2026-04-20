/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Formula {
  id: string;
  name: string;
  category: string;
  equation: string;
  description: string;
  tags: string[];
}

export interface Exercise {
  id: string;
  title: string;
  category: string;
  question: string;
  correctAnswer: number;
  unit: string;
  explanation: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
}
