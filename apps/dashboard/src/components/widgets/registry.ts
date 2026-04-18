import type { ComponentType } from 'react';
import { BooleanWidget } from './BooleanWidget';
import { DateWidget } from './DateWidget';
import { ListWidget } from './ListWidget';
import { MarkdownWidget } from './MarkdownWidget';
import { NumberWidget } from './NumberWidget';
import { SelectWidget } from './SelectWidget';
import { StringWidget } from './StringWidget';
import { TextWidget } from './TextWidget';
import type { WidgetProps } from './types';

export const widgetRegistry: Record<string, ComponentType<WidgetProps>> = {
  string: StringWidget as ComponentType<WidgetProps>,
  text: TextWidget as ComponentType<WidgetProps>,
  number: NumberWidget as ComponentType<WidgetProps>,
  boolean: BooleanWidget as ComponentType<WidgetProps>,
  select: SelectWidget as ComponentType<WidgetProps>,
  list: ListWidget as ComponentType<WidgetProps>,
  date: DateWidget as ComponentType<WidgetProps>,
  datetime: DateWidget as ComponentType<WidgetProps>,
  markdown: MarkdownWidget as ComponentType<WidgetProps>,
};

export function getWidget(type: string): ComponentType<WidgetProps> | null {
  return widgetRegistry[type] ?? null;
}
